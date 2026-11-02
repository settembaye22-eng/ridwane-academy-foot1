
import { createClient } from "https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/+esm";
import { SUPABASE_URL, SUPABASE_ANON_KEY } from "./supabase-config.js";

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

const form = document.getElementById("registration-form");
const message = document.getElementById("form-message");

form.addEventListener("submit", async (event) => {
  event.preventDefault();

  message.textContent = "Envoi en cours...";

  const formData = new FormData(form);

  const registration = {
    parent_name: formData.get("parent_name").trim(),
    child_name: formData.get("child_name").trim(),
    birth_date: formData.get("birth_date"),
    phone: formData.get("phone").trim(),
    category: formData.get("category"),
    message: formData.get("message").trim()
  };

  const { error } = await supabase
    .from("registrations")
    .insert([registration]);

  if (error) {
    console.error("Erreur Supabase :", error);
    message.textContent = "Une erreur est survenue. Réessaie ou contacte l'académie.";
    return;
  }

  message.textContent = "Inscription envoyée avec succès ! Merci.";
  form.reset();
});
