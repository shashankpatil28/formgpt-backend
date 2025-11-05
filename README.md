<!-- File: formgpt-backend/README.md -->
# 🤖 FormGPT Backend

FormGPT Backend is an AI-powered microservice that intelligently converts natural language text prompts into complex, nested, and production-ready JSON form schemas.

It's designed to be the "brain" for any dynamic form builder, survey tool, or CMS, allowing you to generate UIs from simple text commands.

---

## ✨ What's Special About This Project?

This isn't just a simple proxy to an AI. It's an intelligent pipeline that **validates and enforces** the AI's output.

1.  **AI-Powered UI Generation:** Converts plain text ("a contact form with name and email") into a structured JSON schema.
2.  **Rich Schema Generation:** Understands complex requests for nesting (`group`), conditional logic (`condition`), and dynamic lists (`repeater`).
3.  **Robust Validation Pipeline:** This is the most important feature. The AI's response is *never* trusted. It's passed through a "Cleaner" and a "Validator" (built with **Zod**) to *guarantee* the output is a 100% valid, secure, and machine-readable schema that your frontend can safely consume.
4.  **Extensible Schema:** The entire component list and validation rules are defined in a central Zod schema, making it easy to add new form element types.

## 🚀 Tech Stack

* **Node.js** (v20+)
* **Express.js** (for the API)
* **ES Modules** (import/export syntax)
* **OpenRouter** (to connect to any LLM, e.g., `gemini/flash-1.5`)
* **Zod** (for strict schema validation)
* **Docker** (for containerization)

## 📦 Project Structure

```
formgpt-backend/
├── api/
│   ├── controllers/    # Handles HTTP req/res
│   ├── middleware/     # Global error handler
│   ├── routes/         # Defines API endpoints
│   ├── services/       # The core logic (AI call, validation)
│   └── utils/          # Zod schema definitions
├── config/             # Loads .env variables
├── .dockerignore
├── .env.example
├── .gitignore
├── app.js              # Express app setup
├── Dockerfile          # Production container
├── index.js            # Server entry point
├── package.json
└── README.md
```

---

## 🏁 Getting Started

### 1. Prerequisites

* Node.js (v20 or later)
* `npm`
* An [OpenRouter API Key](https://openrouter.ai/keys)

### 2. Local Installation

1.  **Clone the repository:**
    ```bash
    git clone https://your-repo-url/formgpt-backend.git
    cd formgpt-backend
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

3.  **Create your environment file:**
    * Copy the example file:
        ```bash
        cp .env.example .env
        ```
    * Edit `.env` and add your OpenRouter API key:
        ```.env
        # File: .env
        PORT=3000
        OPENROUTER_API_KEY=YOUR_SK_OR_..._KEY_HERE
        ```

4.  **Run the server:**
    * For development (with hot-reloading):
        ```bash
        npm run dev
        ```
    * For production:
        ```bash
        npm start
        ```

The server will be running at `http://localhost:3000`.

---

## 🧪 Testing

You can test the service using any API client like Postman, or `curl`.

### cURL Request

Here is a sample `curl` request to test the main endpoint:

```bash
curl -X POST http://localhost:3000/api/v1/form-builder/generate \
-H "Content-Type: application/json" \
-d '{
  "prompt": "I need a user profile form with a text field for username, an email field, and a select dropdown for their role. The roles should be Admin, User, and Guest."
}'
```

### Postman

1.  **Method:** `POST`
2.  **URL:** `http://localhost:3000/api/v1/form-builder/generate`
3.  **Body:** `raw` > `JSON`
4.  **Content:**
    ```json
    {
      "prompt": "A simple contact form with a text field for name and a textarea for their message."
    }
    ```

### API Endpoint

#### `POST /api/v1/form-builder/generate`

**Request Body:**

```json
{
  "prompt": "<Your natural language form description>"
}
```

**Success Response (200 OK):**

Returns the valid JSON form schema as an array.

```json
[
  {
    "name": "node_1763000000001",
    "label": "Contact Us",
    "type": "group",
    "children": [
      {
        "name": "node_1763000000002",
        "label": "Name",
        "type": "text"
      },
      {
        "name": "node_1763000000003",
        "label": "Message",
        "type": "textarea"
      }
    ]
  }
]
```

**Failure Responses:**

* **400 Bad Request:** Your `"prompt"` was missing or empty.
* **500 Internal Server Error:** The AI failed, the API key is invalid, or the AI's output failed Zod validation. Check the server console logs for a detailed error report.

---

## 🐳 Running with Docker

1.  **Create a `.dockerignore` file:**
    To keep your Docker build clean and fast, create a `.dockerignore` file in the root:

    ```plaintext
    # File: .dockerignore
    node_modules
    .env
    .git
    .gitignore
    README.md
    ```

2.  **Build the Docker image:**
    ```bash
    docker build -t formgpt-backend .
    ```

3.  **Run the Docker container:**
    This command runs the container, maps port `3000`, passes your `.env` file for credentials, and names the container `formgpt`.

    ```bash
    docker run -p 3000:3000 -d --env-file .env --name formgpt formgpt-backend
    ```

4.  **Test it:**
    The container is now running. You can send the same `curl` or Postman request to `http://localhost:3000`.