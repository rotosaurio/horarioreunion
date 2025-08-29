# 🕐 Contador de Reunión del Club

Una aplicación web moderna para mostrar el tiempo restante hasta la próxima reunión del club y gestionar mensajes administrativos.

## ✨ Características

- **Contador en tiempo real** que muestra días, horas, minutos, segundos y milisegundos
- **Reunión programada** para las 11:00 AM (GMT-6) todos los días
- **Sistema de mensajes** con autenticación administrativa
- **Diseño responsivo** con tema oscuro y efectos visuales modernos
- **API robusta** compatible con Vercel y desarrollo local

## 🚀 Despliegue en Vercel

### Opción 1: Despliegue Automático
1. Conecta tu repositorio de GitHub a Vercel
2. Vercel detectará automáticamente que es un proyecto Next.js
3. El despliegue se realizará automáticamente

### Opción 2: Despliegue Manual
```bash
# Instalar Vercel CLI
npm i -g vercel

# Desplegar
vercel

# Para producción
vercel --prod
```

## 🔧 Configuración

### Variables de Entorno (Opcional)
```env
# Para desarrollo local
NODE_ENV=development

# Para producción en Vercel
VERCEL=1
```

### Contraseña de Administrador
- **Contraseña**: `rotosaurio1.`
- **Ruta de administración**: `/mensaje`

## 📁 Estructura del Proyecto

```
├── pages/
│   ├── index.tsx          # Página principal con contador
│   ├── mensaje.tsx        # Panel de administración
│   └── api/
│       ├── message.ts     # API original (híbrida)
│       └── message-v2.ts  # API mejorada (recomendada)
├── data/
│   └── message.json       # Datos locales (solo desarrollo)
├── vercel.json           # Configuración de Vercel
└── README.md
```

## 🛠️ Desarrollo Local

```bash
# Instalar dependencias
npm install

# Ejecutar en desarrollo
npm run dev

# Construir para producción
npm run build

# Ejecutar en producción
npm start
```

## 🌐 URLs

- **Página principal**: `http://localhost:3001` (o puerto disponible)
- **Administración**: `http://localhost:3001/mensaje`
- **API de mensajes**: `http://localhost:3001/api/message-v2`

## 🔒 Seguridad

- La contraseña está hardcodeada en el código (para simplificar)
- En producción, considera usar variables de entorno
- Los mensajes se almacenan en memoria en Vercel
- Para persistencia a largo plazo, considera una base de datos

## 🎨 Tecnologías

- **Next.js 14** - Framework de React
- **TypeScript** - Tipado estático
- **Tailwind CSS** - Estilos y diseño
- **Vercel** - Despliegue y hosting

## 📝 Notas Importantes

1. **En Vercel**: Los mensajes se almacenan en memoria y se reinician con cada deploy
2. **En desarrollo**: Los mensajes se guardan en archivos locales
3. **API recomendada**: Usa `/api/message-v2` para mejor compatibilidad
4. **Contador**: Se actualiza cada milisegundo para máxima precisión

## 🐛 Solución de Problemas

### Error 500 en Vercel
- La API original usa archivos locales que no funcionan en Vercel
- Usa la API v2 (`/api/message-v2`) que es compatible con Vercel

### Error de Hidratación
- Ya solucionado con verificación del cliente
- La hora se actualiza solo en el navegador

### Puerto ocupado
- Next.js automáticamente usa el siguiente puerto disponible
- Verifica la consola para el puerto correcto

## 📞 Soporte

Para problemas o mejoras, contacta al administrador del club.
