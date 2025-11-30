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
    categoria: [ "Primera", "Segunda", "Tercera", "Cuarta" ].sample,
    dedicacion: [ "Simple", "Semiexclusiva", "Exclusiva" ].sample
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

# Grupos de investigacion
grupos = [
  {
    correo_electronico: "ia@utn.edu.ar",
    integrantes: 8,
    nombre: "Grupo de IA Aplicada",
    objetivos: "Aplicación de machine learning en ingeniería.",
    sigla: "GIAA",
    facultad_regional_id: FacultadRegional.first.id,
    director_id: Investigador.first.id,
    vicedirector_id: Investigador.second.id
  },
  {
    correo_electronico: "robotica@utn.edu.ar",
    integrantes: 5,
    nombre: "Grupo de Robótica Industrial",
    objetivos: "Automatización avanzada aplicada a la industria.",
    sigla: "GRI",
    facultad_regional_id: FacultadRegional.second.id,
    director_id: Investigador.second.id,
    vicedirector_id: Investigador.first.id
  }
]

grupos.each do |g|
  GrupoDeInvestigacion.find_or_create_by!(correo_electronico: g[:correo_electronico]) do |grupo|
    grupo.integrantes = g[:integrantes]
    grupo.nombre = g[:nombre]
    grupo.objetivos = g[:objetivos]
    grupo.sigla = g[:sigla]
    grupo.facultad_regional_id = g[:facultad_regional_id]
    grupo.director_id = g[:director_id]
    grupo.vicedirector_id = g[:vicedirector_id]
  end
end

# MEMORIAS
memorias = [
  { anio: "2023",  grupo_de_investigacion_id: GrupoDeInvestigacion.first.id },
  { anio: "2024",  grupo_de_investigacion_id: GrupoDeInvestigacion.first.id }
]

memorias.each do |m|
  Memoria.find_or_create_by!(anio: m[:anio]) do |mem|
    mem.grupo_de_investigacion_id = m[:grupo_de_investigacion_id]
   end
end


# PATENTES
patentes = [
  { identificador: "P-1234", titulo: "Control Inteligente", tipo: "Propiedad Intelectual", grupo_de_investigacion_id: GrupoDeInvestigacion.first.id },
  { identificador: "P-5678", titulo: "Sistema Autónomo", tipo: "Propiedad Industrial", grupo_de_investigacion_id: GrupoDeInvestigacion.second.id }
]

patentes.each do |p|
  Patente.find_or_create_by!(identificador: p[:identificador]) do |pat|
    pat.titulo = p[:titulo]
    pat.tipo = p[:tipo]
    pat.grupo_de_investigacion_id = p[:grupo_de_investigacion_id]
  end
end


# REVISTA + TRABAJO EN REVISTA
revista = Revista.find_or_create_by!(
  nombre: "Journal Ingeniería",
  issn: "1111-2222",
  editorial: "UTN Press",
  pais_id: Pais.first.id
)

trabajos_revista = [
  { titulo: "Redes Neuronales", codigo: "TR-001", revista_id: revista.id, grupo_de_investigacion_id: GrupoDeInvestigacion.first.id }
]

trabajos_revista.each do |t|
  TrabajoEnRevista.find_or_create_by!(codigo: t[:codigo]) do |trab|
    trab.titulo = t[:titulo]
    trab.revista_id = t[:revista_id]
    trab.grupo_de_investigacion_id = t[:grupo_de_investigacion_id]
  end
end

# PUBLICACIÓN EN LIBROS
publicaciones = [
  { titulo: "ML Avanzado", libro: "Avances 2023", capitulo: "5", codigo: "LIB-111", grupo_de_investigacion_id: GrupoDeInvestigacion.first.id }
]

publicaciones.each do |pb|
  PublicacionEnLibro.find_or_create_by!(codigo: pb[:codigo]) do |pub|
    pub.titulo = pb[:titulo]
    pub.libro = pb[:libro]
    pub.capitulo = pb[:capitulo]
    pub.grupo_de_investigacion_id = pb[:grupo_de_investigacion_id]
  end
end

# ARTÍCULO DE DIVULGACIÓN
articulos = [
  { titulo: "Robótica Básica", nombre: "Ciencia Hoy", codigo: "DIV-789", grupo_de_investigacion_id: GrupoDeInvestigacion.second.id }
]

articulos.each do |a|
  ArticuloDeDivulgacion.find_or_create_by!(codigo: a[:codigo]) do |art|
    art.titulo = a[:titulo]
    art.nombre = a[:nombre]
    art.grupo_de_investigacion_id = a[:grupo_de_investigacion_id]
  end
end

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
