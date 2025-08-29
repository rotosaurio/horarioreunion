import { NextApiRequest, NextApiResponse } from 'next';
import fs from 'fs';
import path from 'path';

const MESSAGE_FILE = path.join(process.cwd(), 'data', 'message.json');

// Asegurar que el directorio data existe
const ensureDataDir = () => {
  const dataDir = path.dirname(MESSAGE_FILE);
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
  }
};

// Leer el mensaje actual
const getCurrentMessage = (): string => {
  try {
    ensureDataDir();
    if (fs.existsSync(MESSAGE_FILE)) {
      const data = fs.readFileSync(MESSAGE_FILE, 'utf8');
      const parsed = JSON.parse(data);
      return parsed.message || "¡Bienvenidos al Club!";
    }
  } catch (error) {
    console.error('Error reading message file:', error);
  }
  return "¡Bienvenidos al Club!";
};

// Guardar el mensaje
const saveMessage = (message: string): boolean => {
  try {
    ensureDataDir();
    const data = { message, updatedAt: new Date().toISOString() };
    fs.writeFileSync(MESSAGE_FILE, JSON.stringify(data, null, 2));
    return true;
  } catch (error) {
    console.error('Error saving message:', error);
    return false;
  }
};

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  // Configurar CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method === 'GET') {
    // Obtener el mensaje actual
    const message = getCurrentMessage();
    res.status(200).json({ message });
  } else if (req.method === 'POST') {
    // Actualizar el mensaje
    const { message } = req.body;
    
    if (!message || typeof message !== 'string') {
      return res.status(400).json({ error: 'Mensaje requerido' });
    }

    if (message.trim().length === 0) {
      return res.status(400).json({ error: 'El mensaje no puede estar vacío' });
    }

    const success = saveMessage(message.trim());
    
    if (success) {
      res.status(200).json({ message: 'Mensaje actualizado correctamente' });
    } else {
      res.status(500).json({ error: 'Error al guardar el mensaje' });
    }
  } else {
    res.setHeader('Allow', ['GET', 'POST']);
    res.status(405).json({ error: `Método ${req.method} no permitido` });
  }
}
