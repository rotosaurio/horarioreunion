import { NextApiRequest, NextApiResponse } from 'next';

// Simulación de una base de datos simple en memoria
// En producción, esto debería ser reemplazado por una base de datos real
class SimpleDatabase {
  private static instance: SimpleDatabase;
  private data: { message: string; updatedAt: string };

  private constructor() {
    this.data = {
      message: "¡Bienvenidos al Club! La próxima reunión será a las 11:00 AM. ¡No falten!",
      updatedAt: new Date().toISOString()
    };
  }

  public static getInstance(): SimpleDatabase {
    if (!SimpleDatabase.instance) {
      SimpleDatabase.instance = new SimpleDatabase();
    }
    return SimpleDatabase.instance;
  }

  public getMessage(): { message: string; updatedAt: string } {
    return { ...this.data };
  }

  public setMessage(message: string): boolean {
    try {
      this.data = {
        message,
        updatedAt: new Date().toISOString()
      };
      return true;
    } catch (error) {
      console.error('Error setting message:', error);
      return false;
    }
  }
}

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  // Configurar CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  const db = SimpleDatabase.getInstance();

  if (req.method === 'GET') {
    // Obtener el mensaje actual
    const data = db.getMessage();
    res.status(200).json(data);
  } else if (req.method === 'POST') {
    // Actualizar el mensaje
    const { message } = req.body;
    
    if (!message || typeof message !== 'string') {
      return res.status(400).json({ error: 'Mensaje requerido' });
    }

    if (message.trim().length === 0) {
      return res.status(400).json({ error: 'El mensaje no puede estar vacío' });
    }

    const success = db.setMessage(message.trim());
    
    if (success) {
      const data = db.getMessage();
      res.status(200).json({ 
        message: 'Mensaje actualizado correctamente',
        data 
      });
    } else {
      res.status(500).json({ error: 'Error al guardar el mensaje' });
    }
  } else {
    res.setHeader('Allow', ['GET', 'POST']);
    res.status(405).json({ error: `Método ${req.method} no permitido` });
  }
}
