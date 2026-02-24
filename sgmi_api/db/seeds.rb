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
    "FRSN - San Nicolás", "FRTDF - Tierra del Fuego", "FRT - Tucumán",
    "FRCon - Concordia", "FRJ - Jujuy", "FRLaR - La Rioja", "FRNeu - Neuquén",
    "FRSL - San Luis", "FRSE - Santiago del Estero", "FRO - Oberá", "FRVM - Villa María",
    "INSPT - CABA"
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

  investigadores_count_target = 72
  administrativos_count_target = 18

  # Creamos 90 personas: 72 investigadores + 18 administrativos
  personales_records = []

  personales_source = base_personales.dup
  apellidos_extra = %w[Navarro Molina Peralta Suárez Duarte Cabrera Ponce Aguirre Campos Quiroga Salas Funes Leiva Tapia Varela]
  nombres_extra = %w[Diego Abril Ramiro Julieta Milagros Camila Franco Bautista Eliana Renata Iván Pilar Dante Agustina Nerea]

  while personales_source.size < (investigadores_count_target + administrativos_count_target)
    idx = personales_source.size
    apellido_1 = apellidos_extra[idx % apellidos_extra.size]
    apellido_2 = apellidos_extra[(idx + 5) % apellidos_extra.size]
    apellido = "#{apellido_1} #{apellido_2}"
    nombre = nombres_extra[idx % nombres_extra.size]
    personales_source << [apellido, nombre]
  end

  personales_source.each_with_index do |(apellido, nombre), idx|
    object_type = idx < investigadores_count_target ? "Investigador" : "Administrativo"
    horas = (object_type == "Investigador" ? [20, 25, 30, 35, 40, 45].sample(random: rng) : [20, 30, 40].sample(random: rng))
    dni = 30_000_000 + idx

    personales_records << upsert_by(
      Personal,
      { apellido: apellido, nombre: nombre },
      { apellido: apellido, nombre: nombre, dni: dni, horas_semanales: horas, object_type: object_type }
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

  # Para cada investigador creamos un User asociado
  investigadores_records.each do |invest|
    personal = invest.personal
    base = "#{personal.nombre}.#{personal.apellido}".downcase.gsub(/\s+/, '')
    domain = "utn.com"
    email = "#{base}.#{personal.id}@#{domain}"

    user = upsert_by(
      User,
      { email: email },
      { email: email, password: "123456", password_confirmation: "123456", role: "investigador" }
    )

    invest.update!(user: user) if invest.user != user
  end

  raise "No hay Investigadores para armar grupos" if investigadores_records.empty?

  # -------------------------
  # Países
  # -------------------------
  paises = [
    { nombre: "Argentina", codigo: "AR" }, { nombre: "Brasil", codigo: "BR" }, { nombre: "Chile", codigo: "CL" },
    { nombre: "Uruguay", codigo: "UY" }, { nombre: "Estados Unidos", codigo: "US" }, { nombre: "España", codigo: "ES" },
    { nombre: "Reino Unido", codigo: "GB" }, { nombre: "Alemania", codigo: "DE" }, { nombre: "Francia", codigo: "FR" },
    { nombre: "Italia", codigo: "IT" }, { nombre: "México", codigo: "MX" }, { nombre: "Perú", codigo: "PE" },
    { nombre: "Colombia", codigo: "CO" }, { nombre: "Bolivia", codigo: "BO" }, { nombre: "Paraguay", codigo: "PY" },
    { nombre: "Ecuador", codigo: "EC" }, { nombre: "Canadá", codigo: "CA" }, { nombre: "Portugal", codigo: "PT" },
    { nombre: "Países Bajos", codigo: "NL" }, { nombre: "Suecia", codigo: "SE" }, { nombre: "Noruega", codigo: "NO" },
    { nombre: "China", codigo: "CN" }, { nombre: "Japón", codigo: "JP" }, { nombre: "India", codigo: "IN" },
    { nombre: "Australia", codigo: "AU" }, { nombre: "Nueva Zelanda", codigo: "NZ" }, { nombre: "Sudáfrica", codigo: "ZA" }
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

  paises_records.each_with_index do |pais, idx|
    revistas_seed << {
      nombre: "Revista #{pais.nombre} de Ingeniería",
      issn: format("%04d-%04d", 6000 + idx, 7000 + idx),
      editorial: "Editorial #{pais.codigo}",
      pais: pais
    }
  end

  revistas_records = revistas_seed.map do |r|
    upsert_by(
      Revista,
      { issn: r[:issn] },
      { nombre: r[:nombre], issn: r[:issn], editorial: r[:editorial], pais: r[:pais] }
    )
  end

  # -------------------------
  # Grupos de investigación
  # -------------------------
  grupos_seed = [
    { sigla: "GIAA", nombre: "Grupo de IA Aplicada", correo: "ia@utn.edu.ar", objetivos: "Aplicación de machine learning en ingeniería.", facultad: "FRLP - La Plata" },
    { sigla: "GRI",  nombre: "Grupo de Robótica Industrial", correo: "robotica@utn.edu.ar", objetivos: "Automatización avanzada aplicada a la industria.", facultad: "FRBA - Buenos Aires" },
    { sigla: "GDATA", nombre: "Grupo de Datos y Ciencias", correo: "datos@utn.edu.ar", objetivos: "Análisis de datos para optimización de procesos.", facultad: "FRLP - La Plata" },
    { sigla: "GSOFT", nombre: "Grupo de Desarrollo de Software", correo: "software@utn.edu.ar", objetivos: "Buenas prácticas y herramientas para desarrollo de software en la industria.", facultad: "FRBA - Buenos Aires" },
    { sigla: "GBIO", nombre: "Grupo de Bioingeniería", correo: "bio@utn.edu.ar", objetivos: "Aplicaciones biomédicas y sensores.", facultad: "FRM - Mendoza" },
    { sigla: "GIoT", nombre: "Grupo de IoT y Automatización", correo: "iot@utn.edu.ar", objetivos: "Sistemas embebidos, redes y automatización industrial.", facultad: "FRRo - Rosario" },
    { sigla: "GER", nombre: "Grupo de Energías Renovables", correo: "ger@utn.edu.ar", objetivos: "Conversión, almacenamiento y gestión de energías renovables.", facultad: "FRSN - San Nicolás" },
    { sigla: "GMI", nombre: "Grupo de Materiales Inteligentes", correo: "gmi@utn.edu.ar", objetivos: "Desarrollo y caracterización de nuevos materiales para aplicaciones industriales.", facultad: "FRC - Córdoba" },
    { sigla: "GCIB", nombre: "Grupo de Ciberseguridad", correo: "gcib@utn.edu.ar", objetivos: "Seguridad ofensiva y defensiva en infraestructuras críticas.", facultad: "FRGP - General Pacheco" },
    { sigla: "GI40", nombre: "Grupo de Industria 4.0", correo: "gi40@utn.edu.ar", objetivos: "Integración digital de procesos industriales y gemelos digitales.", facultad: "FRBB - Bahía Blanca" },
    { sigla: "GAP", nombre: "Grupo de Analítica Predictiva", correo: "gap@utn.edu.ar", objetivos: "Modelos predictivos para soporte de decisiones en manufactura y logística.", facultad: "FRR - Rafaela" },
    { sigla: "GPS", nombre: "Grupo de Procesamiento de Señales", correo: "gps@utn.edu.ar", objetivos: "Procesamiento digital de señales en telecomunicaciones e instrumentación.", facultad: "FRN - Buenos Aires Norte" },
    { sigla: "GSC", nombre: "Grupo de Simulación Computacional", correo: "gsc@utn.edu.ar", objetivos: "Modelado numérico y simulación de sistemas complejos.", facultad: "FRRe - Reconquista" },
    { sigla: "GIB", nombre: "Grupo de Ingeniería Biomédica", correo: "gib@utn.edu.ar", objetivos: "Tecnologías para diagnóstico, monitoreo y rehabilitación.", facultad: "FRM - Mendoza" },
    { sigla: "GCL", nombre: "Grupo de Arquitecturas Cloud", correo: "gcl@utn.edu.ar", objetivos: "Diseño de arquitecturas escalables y resilientes en la nube.", facultad: "FRBA - Buenos Aires" },
    { sigla: "GSD", nombre: "Grupo de Sistemas Distribuidos", correo: "gsd@utn.edu.ar", objetivos: "Plataformas distribuidas, tolerancia a fallos y consistencia.", facultad: "FRLP - La Plata" },
    { sigla: "GCS", nombre: "Grupo de Calidad de Software", correo: "gcs@utn.edu.ar", objetivos: "Aseguramiento de calidad, testing y mejora continua de procesos.", facultad: "FRH - Haedo" },
    { sigla: "GVC", nombre: "Grupo de Visión por Computadora", correo: "gvc@utn.edu.ar", objetivos: "Percepción visual aplicada a automatización y control.", facultad: "FRCh - Chubut" }
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
        objetivos: g[:objetivos],
        facultad_regional: fac,
        director: director,
        vicedirector: vicedirector
      }
    )
  end

  # Integrantes por grupo (sin incluir director/vicedirector por validación)
  grupos_records.each_with_index do |grupo, idx|
    excluidos = [grupo.director_id, grupo.vicedirector_id]
    candidatos = investigadores_records.reject { |inv| excluidos.include?(inv.id) }
    cantidad_objetivo = 8 + (idx % 7) # entre 8 y 14

    candidatos.sample(cantidad_objetivo, random: rng).each do |investigador|
      upsert_by(
        GrupoInvestigador,
        { grupo_de_investigacion_id: grupo.id, investigador_id: investigador.id },
        { grupo_de_investigacion: grupo, investigador: investigador }
      )
    end
  end

  # -------------------------
  # Memorias
  # -------------------------
  anios = (2018..2026).map(&:to_s)

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
    # 8 patentes por grupo
    8.times do |i|
      ident = "#{g.sigla}-PAT-#{2020 + i}"
      patentes_records << upsert_by(
        Patente,
        { identificador: ident },
        { identificador: ident, titulo: "#{g.sigla} - Desarrollo tecnológico", tipo: tipos_patente.sample(random: rng), grupo_de_investigacion: g }
      )
    end

    # 8 publicaciones por grupo
    8.times do |i|
      code = "LIB-#{g.sigla}-#{2018 + i}"
      publicaciones_records << upsert_by(
        PublicacionEnLibro,
        { codigo: code },
        { codigo: code, titulo: "Capítulo sobre #{g.sigla}", libro: "Actas UTN", capitulo: "Capítulo especial", grupo_de_investigacion: g }
      )
    end

    # 8 artículos divulgación por grupo
    8.times do |i|
      code = "DIV-#{g.sigla}-#{2018 + i}"
      articulos_records << upsert_by(
        ArticuloDeDivulgacion,
        { codigo: code },
        { codigo: code, titulo: "Divulgación científica - #{g.sigla}", nombre: "Ciencia para Todos UTN", grupo_de_investigacion: g }
      )
    end

    # 8 trabajos por grupo
    8.times do |i|
      code = "TR-#{g.sigla}-#{idx + 1}-#{i + 1}"
      revista = revistas_records.sample(random: rng)

      trabajos_records << upsert_by(
        TrabajoEnRevista,
        { codigo: code },
        { codigo: code, titulo: "Artículo sobre #{g.nombre}", revista: revista, grupo_de_investigacion: g }
      )
    end
  end

 
  # Para cada memoria linkeamos un subconjunto de cada tipo
  memorias_records.each do |m|
    g = m.grupo_de_investigacion

    pats = patentes_records.select { |p| p.grupo_de_investigacion_id == g.id }.sample(4, random: rng)
    pubs = publicaciones_records.select { |p| p.grupo_de_investigacion_id == g.id }.sample(3, random: rng)
    divs = articulos_records.select { |a| a.grupo_de_investigacion_id == g.id }.sample(3, random: rng)
    trs  = trabajos_records.select { |t| t.grupo_de_investigacion_id == g.id }.sample(3, random: rng)

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
  puts "Integrantes grupo-investigador: #{GrupoInvestigador.count}"
  puts "Patentes: #{Patente.count} | Revistas: #{Revista.count} | Trabajos: #{TrabajoEnRevista.count}"
  puts "Libros: #{PublicacionEnLibro.count} | Divulgación: #{ArticuloDeDivulgacion.count}"
  puts "Users: #{User.count}"
end
