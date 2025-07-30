from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from openai import OpenAI
from dotenv import load_dotenv
import os
import re
import time

# Carregar variáveis do .env
load_dotenv()

# Inicializar o FastAPI
app = FastAPI()

# Habilitar CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "https://chatbotvina.vercel.app",
        "https://chatbotvina-1eawywx4m-gabriellemarchiolis-projects.vercel.app",
        "http://localhost:3000",
        "*"  # Para testes locais
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Modelo para validar o input
class ChatInput(BaseModel):
    query: str

# Inicializar o cliente OpenAI
openai_api_key = os.getenv("OPENAI_API_KEY")
vector_store_id = os.getenv("VECTOR_STORE_ID")

if not openai_api_key:
    raise ValueError("OPENAI_API_KEY não está definida no ambiente.")
if not vector_store_id:
    raise ValueError("VECTOR_STORE_ID não está definida no ambiente.")

client = OpenAI(api_key=openai_api_key)

# Criar ou recuperar assistente
try:
    assistant = client.beta.assistants.create(
        name="PrenatalAssistant",
        instructions="Você é um assistente especializado em informações sobre pré-natal. Responda às perguntas com base nos documentos fornecidos no vector store e em seu conhecimento geral. Evite incluir marcações como [X:Y†qualquer_texto] ou 【X:Y†qualquer_texto】 nas respostas.",
        model="gpt-4o-mini",
        tools=[{"type": "file_search"}],
        tool_resources={"file_search": {"vector_store_ids": [vector_store_id]}}
    )
except Exception as e:
    raise ValueError(f"Erro ao criar assistente OpenAI: {str(e)}")

# Função para limpar a resposta
def clean_response(text: str) -> str:
    print(f"Resposta bruta: {text}")  # Log para depuração
    cleaned = re.sub(r'\[(\d+):(\d+)†[\w_]+\]|\【(\d+):(\d+)†[\w_]+】|\s+', ' ', text)  # Remove símbolos e normaliza espaços
    cleaned = cleaned.strip()
    print(f"Resposta limpa: {cleaned}")  # Verifica o resultado
    return cleaned

# Endpoint para processar a query
@app.post("/chat")
async def chat_with_gpt(input: ChatInput):
    try:
        # Criar uma thread
        thread = client.beta.threads.create()

        # Enviar a mensagem do usuário
        client.beta.threads.messages.create(
            thread_id=thread.id,
            role="user",
            content=input.query
        )

        # Executar o assistente
        run = client.beta.threads.runs.create(
            thread_id=thread.id,
            assistant_id=assistant.id
        )

        # Aguardar a conclusão com timeout
        max_wait_time = 30  # Segundos
        start_time = time.time()
        while run.status in ["queued", "in_progress", "requires_action"]:
            if time.time() - start_time > max_wait_time:
                raise HTTPException(status_code=504, detail="Timeout ao processar a query")
            time.sleep(1)  # Aguarda 1 segundo entre verificações
            run = client.beta.threads.runs.retrieve(thread_id=thread.id, run_id=run.id)

        if run.status == "failed":
            raise HTTPException(status_code=500, detail="Falha na execução do assistente")

        # Obter as mensagens
        messages = client.beta.threads.messages.list(thread_id=thread.id)
        if not messages.data:
            raise HTTPException(status_code=500, detail="Nenhuma resposta recebida do assistente")

        response_content = messages.data[0].content[0].text.value
        cleaned_response = clean_response(response_content)

        return {"response": cleaned_response}

    except HTTPException as e:
        raise e
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Erro ao processar a query: {str(e)}")
