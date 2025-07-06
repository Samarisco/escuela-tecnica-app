export async function login(employeeNumber, password) {
  const formData = new URLSearchParams();
  formData.append("username", employeeNumber);
  formData.append("password", password);

  const res = await fetch(`${import.meta.env.VITE_API_URL}/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: formData.toString(),
  });

  if (!res.ok) {
    const errorData = await res.json();
    throw new Error(errorData.detail || "Error al iniciar sesión");
  }

  return await res.json();
}
