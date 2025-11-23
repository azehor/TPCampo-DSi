# This file should ensure the existence of records required to run the application in every environment (production,
# development, test). The code here should be idempotent so that it can be executed at any point in every environment.
# The data can then be loaded with the bin/rails db:seed command (or created alongside the database with db:setup).
#
# Example:
#
#   ["Action", "Comedy", "Drama", "Horror"].each do |genre_name|
#     MovieGenre.find_or_create_by!(name: genre_name)
#   end

facultades = [
  { nombre: "FRBA - Buenos Aires" },
  { nombre: "FRA - Avellaneda" },
  { nombre: "FRBB - Bahía Blanca" },
  { nombre: "FRN - Buenos Aires Norte" },
  { nombre: "FRCh - Chubut" },
  { nombre: "FRCU - Concepción del Uruguay" },
  { nombre: "FRC - Córdoba" },
  { nombre: "FRD - Delta" },
  { nombre: "FRGP - General Pacheco" },
  { nombre: "FRH - Haedo" },
  { nombre: "FRLP - La Plata" },
  { nombre: "FRM - Mendoza" },
  { nombre: "FRP - Paraná" },
  { nombre: "FRR - Rafaela" },
  { nombre: "FRRe - Reconquista" },
  { nombre: "FRRes - Resistencia" },
  { nombre: "FRRG - Río Grande" },
  { nombre: "FRRo - Rosario" },
  { nombre: "FRSF - San Francisco" },
  { nombre: "FRSN - San Nicolás" },
  { nombre: "FRSF - Santa Fe" },
  { nombre: "FRTDF - Tierra del Fuego" },
  { nombre: "FRT - Tucumán" }
]

facultades.each do |fac|
  FacultadRegional.find_or_create_by!(nombre: fac[:nombre])
end

puts "Facultades Regionales cargadas correctamente"
puts "Total: #{FacultadRegional.count}"


# db/seeds.rb

# Personal
personales = [
  { apellido: "García", nombre: "Nahuel", horas_semanales: 40, object_type: "Investigador" },
  { apellido: "Pérez", nombre: "Lucía", horas_semanales: 35, object_type: "Investigador" },
  { apellido: "Martínez", nombre: "Joaquín", horas_semanales: 30, object_type: "Investigador" },
  { apellido: "Sosa", nombre: "Valentina", horas_semanales: 45, object_type: "Investigador" },
  { apellido: "López", nombre: "Mateo", horas_semanales: 20, object_type: "Investigador" },
  { apellido: "Fernández", nombre: "Ana", horas_semanales: 40, object_type: "Investigador" },
  { apellido: "Romero", nombre: "Marcos", horas_semanales: 35, object_type: "Investigador" },
  { apellido: "Ruiz", nombre: "Carla", horas_semanales: 30, object_type: "Investigador" },
  { apellido: "Álvarez", nombre: "Tomás", horas_semanales: 25, object_type: "Investigador" },
  { apellido: "Silva", nombre: "Florencia", horas_semanales: 40, object_type: "Investigador" }
]

personales.each do |p|
  Personal.find_or_create_by!(
    apellido: p[:apellido],
    nombre: p[:nombre],
    horas_semanales: p[:horas_semanales],
    object_type: p[:object_type]
  )
end

puts "Personales cargados correctamente"
puts "Total: #{Personal.count}"

# Investigador
Personal.all.each do |p|
  Investigador.find_or_create_by!(
    personal: p,
    categoria: ["Primera", "Segunda", "Tercera", "Cuarta"].sample,
    dedicacion: ["Simple", "Semiexclusiva", "Exclusiva"].sample
  )
end

puts "Investigadores creados correctamente"
puts "Total: #{Investigador.count}"

# Pais

paises = [
  { nombre: "Argentina", codigo: "AR" },
  { nombre: "Brasil", codigo: "BR" },
  { nombre: "Chile", codigo: "CL" },
  { nombre: "Uruguay", codigo: "UY" },
  { nombre: "Paraguay", codigo: "PY" },
  { nombre: "Bolivia", codigo: "BO" },
  { nombre: "Perú", codigo: "PE" },
  { nombre: "Colombia", codigo: "CO" },
  { nombre: "Venezuela", codigo: "VE" },
  { nombre: "Ecuador", codigo: "EC" },
  { nombre: "México", codigo: "MX" },
  { nombre: "Guatemala", codigo: "GT" },
  { nombre: "Honduras", codigo: "HN" },
  { nombre: "El Salvador", codigo: "SV" },
  { nombre: "Panamá", codigo: "PA" },
  { nombre: "Costa Rica", codigo: "CR" },
  { nombre: "Nicaragua", codigo: "NI" },
  { nombre: "Cuba", codigo: "CU" },
  { nombre: "República Dominicana", codigo: "DO" },
  { nombre: "Puerto Rico", codigo: "PR" },
  { nombre: "Estados Unidos", codigo: "US" },
  { nombre: "Canadá", codigo: "CA" },
  { nombre: "España", codigo: "ES" },
  { nombre: "Portugal", codigo: "PT" },
  { nombre: "Francia", codigo: "FR" },
  { nombre: "Alemania", codigo: "DE" },
  { nombre: "Italia", codigo: "IT" },
  { nombre: "Reino Unido", codigo: "GB" },
  { nombre: "Irlanda", codigo: "IE" },
  { nombre: "Países Bajos", codigo: "NL" },
  { nombre: "Bélgica", codigo: "BE" },
  { nombre: "Suiza", codigo: "CH" },
  { nombre: "Austria", codigo: "AT" },
  { nombre: "Dinamarca", codigo: "DK" },
  { nombre: "Noruega", codigo: "NO" },
  { nombre: "Suecia", codigo: "SE" },
  { nombre: "Finlandia", codigo: "FI" },
  { nombre: "Rusia", codigo: "RU" },
  { nombre: "China", codigo: "CN" },
  { nombre: "Japón", codigo: "JP" },
  { nombre: "Corea del Sur", codigo: "KR" },
  { nombre: "India", codigo: "IN" },
  { nombre: "Australia", codigo: "AU" },
  { nombre: "Nueva Zelanda", codigo: "NZ" },
  { nombre: "Sudáfrica", codigo: "ZA" },
  { nombre: "Egipto", codigo: "EG" },
  { nombre: "Marruecos", codigo: "MA" },
  { nombre: "Argelia", codigo: "DZ" },
  { nombre: "Nigeria", codigo: "NG" },
  { nombre: "Ghana", codigo: "GH" },
  { nombre: "Kenya", codigo: "KE" },
  { nombre: "Etiopía", codigo: "ET" },
  { nombre: "Israel", codigo: "IL" },
  { nombre: "Arabia Saudita", codigo: "SA" },
  { nombre: "Turquía", codigo: "TR" },
  { nombre: "Grecia", codigo: "GR" },
  { nombre: "Polonia", codigo: "PL" },
  { nombre: "Ucrania", codigo: "UA" },
  { nombre: "Rumania", codigo: "RO" },
  { nombre: "Hungría", codigo: "HU" },
  { nombre: "Chequia", codigo: "CZ" },
  { nombre: "Eslovaquia", codigo: "SK" }
]

paises.each do |pais|
  Pais.find_or_create_by!(codigo: pais[:codigo]) do |p|
    p.nombre = pais[:nombre]
  end
end
puts "Paises creados correctamente"
puts "Total: #{Pais.count}"

# Crear usuario admin
admin_email  = ENV["ADMIN_EMAIL"]
admin_pass   = ENV["ADMIN_PASSWORD"]
if User.find_by(email: "admin@utn.com").nil?
  User.create!(
    email: admin_email,
    password: admin_pass,
    password_confirmation: admin_pass,
    role: "admin"
  )
end
