"use server";
async function getEncryptionKey() {
  const keyData = process.env.ENCRYPTION_KEY; // Lee la clave del entorno
  if (!keyData) {
    throw new Error("Encryption key not found in environment variables");
  }

  // Decodifica la clave desde base64 a un ArrayBuffer
  const keyBytes = Uint8Array.from(atob(keyData), (c) => c.charCodeAt(0));

  // Importa la clave en formato raw
  const importedKey = await crypto.subtle.importKey(
    "raw", // Tipo de clave raw
    keyBytes.buffer, // ArrayBuffer de la clave
    {
      name: "AES-GCM",
      length: 256,
    },
    true,
    ["encrypt", "decrypt"]
  );

  return importedKey;
}

export async function encrypt(payload) {
  const key = await getEncryptionKey();
  const iv = crypto.getRandomValues(new Uint8Array(12));
  const encodedPayload = new TextEncoder().encode(payload);

  const cipherTextBuffer = await crypto.subtle.encrypt(
    {
      name: "AES-GCM",
      iv,
    },
    key,
    encodedPayload
  );

  const ciphertext = Array.from(new Uint8Array(cipherTextBuffer));
  const ciphertextBase64 = btoa(String.fromCharCode(...ciphertext));
  const ivBase64 = btoa(String.fromCharCode(...iv));

  return `${ivBase64}.${ciphertextBase64}`;
}

export async function decrypt(encryptedPayload) {
  const key = await getEncryptionKey();
  const [ivBase64, ciphertextBase64] = encryptedPayload.split(".");

  const iv = Uint8Array.from(atob(ivBase64), (c) => c.charCodeAt(0));
  const ciphertext = Uint8Array.from(atob(ciphertextBase64), (c) =>
    c.charCodeAt(0)
  );

  const decryptedBuffer = await crypto.subtle.decrypt(
    {
      name: "AES-GCM",
      iv: iv,
    },
    key,
    ciphertext
  );

  const decodedPayload = new TextDecoder().decode(decryptedBuffer);

  return decodedPayload;
}
