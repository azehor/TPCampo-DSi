# db/seeds.rb
# Idempotente: se puede ejecutar mil veces sin duplicar.
# Genera más datos y crea relaciones HABTM con Memorias.

ActiveRecord::Base.transaction do
  # -------------------------
  # Helpers
  # -------------------------
  def upsert_by(klass, finder, attrs)
    record = klass.find_or_initialize_by(finder)
    record.assign_attributes(attrs)
    record.save!
    record
  end

  def sample_distinct(arr, exclude: nil)
    pool = exclude ? (arr - [exclude]).compact : arr.compact
    pool.sample || exclude || arr.sample
  end

  rng = Random.new(1234) # misma data siempre

  categorias  = ["Primera", "Segunda", "Tercera", "Cuarta"].freeze
  dedicaciones = ["Simple", "Semiexclusiva", "Exclusiva"].freeze

  # -------------------------
  # Facultades
  # -------------------------
  facultades = [
    "FRBA - Buenos Aires", "FRA - Avellaneda", "FRBB - Bahía Blanca", "FRN - Buenos Aires Norte",
    "FRCh - Chubut", "FRCU - Concepción del Uruguay", "FRC - Córdoba", "FRD - Delta",
    "FRGP - General Pacheco", "FRH - Haedo", "FRLP - La Plata", "FRM - Mendoza",
    "FRP - Paraná", "FRR - Rafaela", "FRRe - Reconquista", "FRRes - Resistencia",
    "FRRG - Río Grande", "FRRo - Rosario", "FRSF - San Francisco", "FRSF - Santa Fe",
    "FRSN - San Nicolás", "FRTDF - Tierra del Fuego", "FRT - Tucumán"
  ].uniq

  facultades_records = facultades.map do |nombre|
    upsert_by(FacultadRegional, { nombre: nombre }, { nombre: nombre })
  end

  # -------------------------
  # Personales
  # -------------------------
  base_personales = [
    ["García", "Nahuel"], ["Pérez", "Lucía"], ["Martínez", "Joaquín"], ["Sosa", "Valentina"],
    ["López", "Mateo"], ["Fernández", "Ana"], ["Romero", "Marcos"], ["Ruiz", "Carla"],
    ["Álvarez", "Tomás"], ["Silva", "Florencia"], ["González", "Mariana"], ["Silvetti", "Hugo"],
    ["Benítez", "Esteban"], ["Cordero", "Paolo"], ["Mares", "Luciana"], ["Ferrer", "Sergio"],
    ["Ibarra", "Noelia"], ["Paz", "Carolina"], ["Acosta", "Bruno"], ["Rojas", "Micaela"],
    ["Giménez", "Santino"], ["Vega", "Martina"], ["Castro", "Agustín"], ["Herrera", "Sofía"]
  ].freeze

  investigadores_count_target = 20
  administrativos_count_target = 6

  # Creamos 26 personas: 20 investigadores + 6 administrativos
  personales_records = []

  base_personales.each_with_index do |(apellido, nombre), idx|
    object_type = idx < investigadores_count_target ? "Investigador" : "Administrativo"
    horas = (object_type == "Investigador" ? [20, 25, 30, 35, 40, 45].sample(random: rng) : [20, 30, 40].sample(random: rng))

    personales_records << upsert_by(
      Personal,
      { apellido: apellido, nombre: nombre },
      { apellido: apellido, nombre: nombre, horas_semanales: horas, object_type: object_type }
    )
  end

  # -------------------------
  # Investigadores
  # -------------------------
  investigadores_records = Personal.where(object_type: "Investigador").map do |p|
    upsert_by(
      Investigador,
      { personal_id: p.id },
      {
        personal: p,
        categoria: categorias.sample(random: rng),
        dedicacion: dedicaciones.sample(random: rng),
        programa_incentivo: [nil, 1, 2, 3].sample(random: rng)
      }
    )
  end

  raise "No hay Investigadores para armar grupos" if investigadores_records.empty?

  # -------------------------
  # Países
  # -------------------------
  paises = [
    { nombre: "Argentina", codigo: "AR" }, { nombre: "Brasil", codigo: "BR" }, { nombre: "Chile", codigo: "CL" },
    { nombre: "Uruguay", codigo: "UY" }, { nombre: "Estados Unidos", codigo: "US" }, { nombre: "España", codigo: "ES" },
    { nombre: "Reino Unido", codigo: "GB" }, { nombre: "Alemania", codigo: "DE" }, { nombre: "Francia", codigo: "FR" },
    { nombre: "Italia", codigo: "IT" }
  ].uniq { |p| p[:codigo] }

  paises_records = paises.map do |p|
    upsert_by(Pais, { codigo: p[:codigo] }, { codigo: p[:codigo], nombre: p[:nombre] })
  end

  pais_ar = Pais.find_by(codigo: "AR") || paises_records.first

  # -------------------------
  # Revistas
  # -------------------------
  revistas_seed = [
    { nombre: "Journal Ingeniería", issn: "1111-2222", editorial: "UTN Press", pais: pais_ar },
    { nombre: "Revista UTN Avances", issn: "3333-4444", editorial: "UTN Editorial", pais: pais_ar },
    { nombre: "International Engineering Review", issn: "5555-6666", editorial: "Global Science", pais: Pais.find_by(codigo: "US") || pais_ar }
  ]

  revistas_records = revistas_seed.map do |r|
    upsert_by(
      Revista,
      { nombre: r[:nombre] },
      { nombre: r[:nombre], issn: r[:issn], editorial: r[:editorial], pais: r[:pais] }
    )
  end

  # -------------------------
  # Grupos de investigación
  # -------------------------
  grupos_seed = [
    { sigla: "GIAA", nombre: "Grupo de IA Aplicada", correo: "ia@utn.edu.ar", integrantes: 8, objetivos: "Aplicación de machine learning en ingeniería.", facultad: "FRLP - La Plata" },
    { sigla: "GRI",  nombre: "Grupo de Robótica Industrial", correo: "robotica@utn.edu.ar", integrantes: 5, objetivos: "Automatización avanzada aplicada a la industria.", facultad: "FRBA - Buenos Aires" },
    { sigla: "GDATA", nombre: "Grupo de Datos y Ciencias", correo: "datos@utn.edu.ar", integrantes: 7, objetivos: "Análisis de datos para optimización de procesos.", facultad: "FRLP - La Plata" },
    { sigla: "GSOFT", nombre: "Grupo de Desarrollo de Software", correo: "software@utn.edu.ar", integrantes: 9, objetivos: "Buenas prácticas y herramientas para desarrollo de software en la industria.", facultad: "FRBA - Buenos Aires" },
    { sigla: "GBIO", nombre: "Grupo de Bioingeniería", correo: "bio@utn.edu.ar", integrantes: 6, objetivos: "Aplicaciones biomédicas y sensores.", facultad: "FRM - Mendoza" },
    { sigla: "GIoT", nombre: "Grupo de IoT y Automatización", correo: "iot@utn.edu.ar", integrantes: 10, objetivos: "Sistemas embebidos, redes y automatización industrial.", facultad: "FRRo - Rosario" }
  ]

  grupos_records = grupos_seed.map.with_index do |g, idx|
    fac = FacultadRegional.find_by(nombre: g[:facultad]) || facultades_records.first

    director = investigadores_records[idx % investigadores_records.size]
    vicedirector = sample_distinct(investigadores_records, exclude: director)

    upsert_by(
      GrupoDeInvestigacion,
      { sigla: g[:sigla] },
      {
        sigla: g[:sigla],
        nombre: g[:nombre],
        correo_electronico: g[:correo],
        integrantes: g[:integrantes],
        objetivos: g[:objetivos],
        facultad_regional: fac,
        director: director,
        vicedirector: vicedirector
      }
    )
  end

  # -------------------------
  # Memorias
  # -------------------------
  anios = (2021..2025).map(&:to_s)

  memorias_records = []
  grupos_records.each do |grupo|
    anios.each do |anio|
      memorias_records << upsert_by(
        Memoria,
        { anio: anio, grupo_de_investigacion_id: grupo.id },
        { anio: anio, grupo_de_investigacion: grupo }
      )
    end
  end

  # -------------------------
  # Patentes / Publicaciones / Divulgación / Trabajos en revista
  # -------------------------
  tipos_patente = ["Propiedad Industrial", "Propiedad Intelectual"].freeze

  patentes_records = []
  publicaciones_records = []
  articulos_records = []
  trabajos_records = []

  grupos_records.each_with_index do |g, idx|
    # 3 patentes por grupo
    3.times do |i|
      ident = "#{g.sigla}-PAT-#{2020 + i}"
      patentes_records << upsert_by(
        Patente,
        { identificador: ident },
        { identificador: ident, titulo: "#{g.sigla} - Desarrollo #{i + 1}", tipo: tipos_patente.sample(random: rng), grupo_de_investigacion: g }
      )
    end

    # 2 publicaciones por grupo
    2.times do |i|
      code = "LIB-#{g.sigla}-#{2023 + i}"
      publicaciones_records << upsert_by(
        PublicacionEnLibro,
        { codigo: code },
        { codigo: code, titulo: "Capítulo #{i + 1} - #{g.sigla}", libro: "Actas UTN #{2023 + i}", capitulo: (i + 1).to_s, grupo_de_investigacion: g }
      )
    end

    # 2 artículos divulgación por grupo
    2.times do |i|
      code = "DIV-#{g.sigla}-#{2023 + i}"
      articulos_records << upsert_by(
        ArticuloDeDivulgacion,
        { codigo: code },
        { codigo: code, titulo: "Divulgación #{i + 1} - #{g.sigla}", nombre: "Ciencia para Todos UTN", grupo_de_investigacion: g }
      )
    end

    # 2 trabajos por grupo (revistas variadas)
    2.times do |i|
      code = "TR-#{g.sigla}-#{idx + 1}-#{i + 1}"
      revista = revistas_records.sample(random: rng)

      trabajos_records << upsert_by(
        TrabajoEnRevista,
        { codigo: code },
        { codigo: code, titulo: "Artículo #{i + 1} sobre #{g.nombre}", revista: revista, grupo_de_investigacion: g }
      )
    end
  end

 
  # Para cada memoria: linkeamos un subconjunto de cada tipo
  memorias_records.each do |m|
    g = m.grupo_de_investigacion

    pats = patentes_records.select { |p| p.grupo_de_investigacion_id == g.id }.sample(2, random: rng)
    pubs = publicaciones_records.select { |p| p.grupo_de_investigacion_id == g.id }.sample(1, random: rng)
    divs = articulos_records.select { |a| a.grupo_de_investigacion_id == g.id }.sample(1, random: rng)
    trs  = trabajos_records.select { |t| t.grupo_de_investigacion_id == g.id }.sample(1, random: rng)

    pats.each { |p| m.patentes << p unless m.patentes.exists?(p.id) }
    pubs.each { |p| m.publicacion_en_libros << p unless m.publicacion_en_libros.exists?(p.id) }
    divs.each { |a| m.articulo_de_divulgacions << a unless m.articulo_de_divulgacions.exists?(a.id) }
    trs.each  { |t| m.trabajo_en_revistas << t unless m.trabajo_en_revistas.exists?(t.id) }
  end

  # -------------------------
  # Usuario admin
  # -------------------------
  admin_email = ENV.fetch("ADMIN_EMAIL", "admin@utn.com")
  admin_pass  = ENV.fetch("ADMIN_PASSWORD", "Admin1234!")

  upsert_by(
    User,
    { email: admin_email },
    { email: admin_email, password: admin_pass, password_confirmation: admin_pass, role: "admin" }
  )

  puts "Seed OK"
  puts "Facultades: #{FacultadRegional.count}"
  puts "Personales: #{Personal.count} | Investigadores: #{Investigador.count}"
  puts "Grupos: #{GrupoDeInvestigacion.count} | Memorias: #{Memoria.count}"
  puts "Patentes: #{Patente.count} | Revistas: #{Revista.count} | Trabajos: #{TrabajoEnRevista.count}"
  puts "Libros: #{PublicacionEnLibro.count} | Divulgación: #{ArticuloDeDivulgacion.count}"
  puts "Users: #{User.count}"
end
