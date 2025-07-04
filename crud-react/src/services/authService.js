export async function login(employeeNumber, password) {
  const response = await fetch("http://localhost:8000/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      employee_number: employeeNumber,
      password: password,
    }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.detail || "Error al iniciar sesión");
  }

  const data = await response.json();
  return data; // { role: "admin" }
}
