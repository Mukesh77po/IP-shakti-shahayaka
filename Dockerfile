FROM node:22-bookworm-slim

WORKDIR /app

# Install Python for the RAG engine
RUN apt-get update \
    && apt-get install -y python3 python3-venv \
    && rm -rf /var/lib/apt/lists/*

# Python virtual environment
RUN python3 -m venv /opt/venv
ENV PATH="/opt/venv/bin:$PATH"

# Install Python dependencies
COPY requirements.txt ./
RUN pip install --upgrade pip \
    && pip install -r requirements.txt

# Install Node dependencies
COPY package*.json ./
RUN npm install

# Copy application
COPY . .

# Build authoritative corpus + ChromaDB + React/Express
RUN python populate_authoritative_corpus.py \
    && python ingest.py \
    && npm run build

ENV NODE_ENV=production

EXPOSE 10000

CMD ["npm", "start"]