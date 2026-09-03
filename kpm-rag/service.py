from langchain_community.document_loaders import PyPDFLoader
from langchain.text_splitter import RecursiveCharacterTextSplitter
from langchain_chroma import Chroma
from langchain_huggingface import HuggingFaceEmbeddings

class PDFToChromaETL:
    def __init__(self, persist_dir="./chroma_db"):
        self.persist_dir = persist_dir
        self.embeddings = HuggingFaceEmbeddings(
            model_name="sentence-transformers/all-MiniLM-L6-v2"
        )

    def extract(self, pdf_path):                 # E
        loader = PyPDFLoader(pdf_path)
        documents = loader.load()
        return documents

    def transform(self, docs):                   # T
        splitter = RecursiveCharacterTextSplitter(chunk_size=1000,chunk_overlap=150)
        chunks = splitter.split_documents(docs)
        return chunks

    def load(self, chunks):                      # L
        db = Chroma.from_documents(
            documents=chunks,
            embedding=self.embeddings,
            persist_directory=self.persist_dir
        )
        return db

    def run(self, pdf_path):
        docs = self.extract(pdf_path)
        chunks = self.transform(docs)
        db = self.load(chunks)
        return db

# --- Run the full ETL job ---
etl = PDFToChromaETL()
db = etl.run("Belal_Bassem_CV.pdf")

query = "What is my role in Jackaroo"
chunks = db.similarity_search(query, k=3)
for i, d in enumerate(chunks):
    print(f"chunk : {i} ")
    print(d.metadata["page"], d.page_content)
