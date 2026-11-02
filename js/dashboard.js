
import { createClient } from "https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/+esm";
import { SUPABASE_URL, SUPABASE_ANON_KEY } from "./supabase-config.js";

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

const message = document.getElementById("dashboard-message");
const list = document.getElementById("registrations-list");
const logoutButton = document.getElementById("logout-button");

async function loadDashboard() {
  // Vérifier la connexion
  const { data: sessionData, error: sessionError } =
    await supabase.auth.getSession();

  if (sessionError || !sessionData.session) {
    window.location.href = "admin.html";
    return;
  }

  // Vérifier les droits administrateur
  const { data: isAdmin, error: adminError } =
    await supabase.rpc("is_admin");

  if (adminError || !isAdmin) {
    await supabase.auth.signOut();
    window.location.href = "admin.html";
    return;
  }

  // Charger les inscriptions
  const { data: registrations, error } = await supabase
    .from("registrations")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    console.error(error);
    message.textContent = "Impossible de charger les inscriptions.";
    return;
  }

  if (!registrations || registrations.length === 0) {
    message.textContent = "Aucune inscription pour le moment.";
    return;
  }

  message.textContent = `${registrations.length} inscription(s) trouvée(s).`;

  list.replaceChildren();

  registrations.forEach((registration) => {
    const row = document.createElement("tr");

    const values = [
      registration.parent_name,
      registration.child_name,
      registration.birth_date,
      registration.phone,
      registration.category,
      registration.status || "pending"
    ];

    values.forEach((value, index) => {
      const cell = document.createElement("td");

      if (index === 5) {
        const status = document.createElement("span");
        status.className = "status";
        status.textContent = value;
        cell.appendChild(status);
      } else {
        cell.textContent = value ?? "";
      }

      row.appendChild(cell);
    });

    list.appendChild(row);
  });
}

// Déconnexion
logoutButton.addEventListener("click", async () => {
  await supabase.auth.signOut();
  window.location.href = "admin.html";
});

loadDashboard();
