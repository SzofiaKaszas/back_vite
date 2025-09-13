export async function getProfile() {
  const token = localStorage.getItem("token");
  const res = await fetch("http://localhost:3000/api/profile", {
    headers: { "Authorization": `Bearer ${token}` }
  });

  const data = await res.json();
  console.log(data);
}