
import { createClient } from "https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/+esm";
import { SUPABASE_URL, SUPABASE_ANON_KEY } from "./supabase-config.js";

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

const form = document.getElementById("admin-login-form");
const message = document.getElementById("login-message");

form.addEventListener("submit", async (event) => {
  event.preventDefault();

  message.textContent = "Connexion en cours...";

  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value;

  // Connexion avec Supabase
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password
  });

  if (error) {
    message.textContent = "E-mail ou mot de passe incorrect.";
    console.error(error);
    return;
  }

  // Vérifier que le compte est administrateur
  const { data: isAdmin, error: adminError } =
    await supabase.rpc("is_admin");

  if (adminError || !isAdmin) {
    await supabase.auth.signOut();
    message.textContent = "Accès refusé : compte non administrateur.";
    console.error(adminError);
    return;
  }

 message.textContent = "Connexion réussie ! Redirection...";

window.location.href = "dashboard.html";

  // La page du tableau de bord sera créée à l'étape suivante.
});
