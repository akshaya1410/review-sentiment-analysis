"""
Optional PyTorch/Keras LSTM Sentiment Analysis Trainer.
This module demonstrates deep learning architectures for sentiment classification.
"""

import sys
import json
import torch
import torch.nn as nn
from torch.utils.data import Dataset, DataLoader
from pathlib import Path

# Path setup
BASE_DIR = Path(__file__).resolve().parent.parent
sys.path.append(str(BASE_DIR))

from app.services.preprocessing import clean_text

class Vocabulary:
    def __init__(self, max_size=10000):
        self.max_size = max_size
        self.word2idx = {"<PAD>": 0, "<UNK>": 1}
        self.idx2word = {0: "<PAD>", 1: "<UNK>"}

    def build_vocab(self, texts):
        from collections import Counter
        counter = Counter()
        for text in texts:
            counter.update(text.split())
        
        most_common = counter.most_common(self.max_size - 2)
        for word, _ in most_common:
            idx = len(self.word2idx)
            self.word2idx[word] = idx
            self.idx2word[idx] = word

    def text_to_sequence(self, text, max_len=200):
        tokens = text.split()
        seq = [self.word2idx.get(t, 1) for t in tokens[:max_len]]
        if len(seq) < max_len:
            seq = seq + [0] * (max_len - len(seq))
        return seq

class LSTMSentimentModel(nn.Module):
    def __init__(self, vocab_size, embed_dim=128, hidden_dim=64, num_layers=2, dropout=0.3):
        super(LSTMSentimentModel, self).__init__()
        self.embedding = nn.Embedding(vocab_size, embed_dim, padding_idx=0)
        self.lstm = nn.LSTM(embed_dim, hidden_dim, num_layers=num_layers, batch_first=True, dropout=dropout if num_layers > 1 else 0)
        self.dropout = nn.Dropout(dropout)
        self.fc = nn.Linear(hidden_dim, 1)
        self.sigmoid = nn.Sigmoid()

    def forward(self, x):
        embedded = self.embedding(x)
        lstm_out, (ht, ct) = self.lstm(embedded)
        # Use final hidden state
        out = self.dropout(ht[-1])
        out = self.fc(out)
        return self.sigmoid(out)

def train_demo():
    print("[INFO] Optional LSTM Sentiment Module initialized.")
    print("This module provides an optional deep learning extension using PyTorch.")

if __name__ == "__main__":
    train_demo()
