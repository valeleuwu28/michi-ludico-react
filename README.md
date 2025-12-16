# michi-ludico-react
# 🎮 Michi Juegos - Plataforma de Juegos de Mesa

Descripción del Proyecto
Michi Lúdico es una aplicación web moderna para el alquiler de juegos de mesa, desarrollada con React como parte del examen final de la asignatura Tecnologías Web I. La aplicación migra una página web estática original (HTML/CSS/JS) a una arquitectura modular basada en componentes React, incorporando funcionalidades avanzadas como autenticación, sistema de reservas en tiempo real, consumo de APIs, y un chatbot con IA.

## 🚀 Características
- Catálogo interactivo de juegos
- Sistema de reservas
- Chatbot IA con Gemini API
- Panel de administración

## 📋 Requisitos
- XAMPP 8.0+ (PHP 8.0+, MySQL 8.0+)
- Node.js 18+
- Cuenta de Google Cloud (para Gemini API)


 Instalación y Ejecución
Requisitos Previos
Node.js (v16 o superior)

npm o yarn

XAMPP/WAMP con PHP y MySQL

Git

Pasos de Instalación
Clonar el repositorio:

bash
git clone [url-del-repositorio]
cd michi-ludico
Instalar dependencias:

bash
npm install
# o
yarn install
Configurar base de datos:

Importar database.sql a phpMyAdmin

Verificar credenciales en src/services/

Configurar API backend:

Mover carpeta michi_api/ a htdocs/ de XAMPP

Ajustar rutas en archivos PHP si es necesario

Iniciar servidores:

bash
# Frontend React
npm run dev

# Backend PHP
# Iniciar Apache y MySQL desde XAMPP
Acceder a la aplicación:

Frontend: http://localhost:5174

Backend API: http://localhost/michi_api/
