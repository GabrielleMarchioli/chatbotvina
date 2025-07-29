from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from openai import OpenAI
from dotenv import load_dotenv
import os

# Carregar variáveis do .env
load_dotenv()

# Inicializar o FastAPI
app = FastAPI()

# Habilitar CORS para permitir requisições do frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["https://chatbotvina.vercel.app/chat"],  # Ajuste para o domínio do seu frontend, se necessário
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Modelo para validar o input do usuário
class ChatInput(BaseModel):
    query: str

# Inicializar o cliente OpenAI
openai_api_key = os.getenv("OPENAI_API_KEY")
vector_store_id = os.getenv("VECTOR_STORE_ID")
client = OpenAI(api_key=openai_api_key)

# Criar ou recuperar um assistente com o vector store
assistant = client.beta.assistants.create(
    name="PrenatalAssistant",
    instructions="Você é um assistente especializado em informações sobre pré-natal. Responda às perguntas com base nos documentos fornecidos no vector store e em seu conhecimento geral.",
    model="gpt-4o-mini",
    tools=[{"type": "file_search"}],
    tool_resources={"file_search": {"vector_store_ids": [vector_store_id]}}
) if vector_store_id else None

# Endpoint para processar a query do usuário
@app.post("/chat")
async def chat_with_gpt(input: ChatInput):
    try:
        # Criar uma thread para a conversa
        thread = client.beta.threads.create()

        # Enviar a mensagem do usuário
        client.beta.threads.messages.create(
            thread_id=thread.id,
            role="user",
            content=input.query
        )

        # Executar o assistente na thread
        run = client.beta.threads.runs.create(
            thread_id=thread.id,
            assistant_id=assistant.id
        )

        # Aguardar a conclusão da execução
        while run.status in ["queued", "in_progress"]:
            run = client.beta.threads.runs.retrieve(thread_id=thread.id, run_id=run.id)

        # Obter as mensagens da thread
        messages = client.beta.threads.messages.list(thread_id=thread.id)
        response_content = messages.data[0].content[0].text.value

        return {"response": response_content}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"An error occurred: {str(e)}")