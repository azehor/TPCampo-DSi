class ExcelController < ApplicationController
  def generar
    if !params.has_key?(:anio) || !params.has_key?(:grupo)
      render json: { error: "Año o Grupo faltante" } and return
    end
    anio = params[:anio].to_i
    grupo_id = params[:grupo].to_i
    grupo = GrupoDeInvestigacion.find(grupo_id)
    memoria = Memoria.where(grupo_de_investigacion_id: grupo, anio: anio).first
    if memoria.nil? then render json: { error: "Memoria del año #{anio} para el grupo #{grupo.nombre} inexistente" } and return end
    director = grupo.director.personal
    vicedirector = grupo.vicedirector.personal
    @revistas = memoria.trabajo_en_revistas
    @libros = memoria.publicacion_en_libros
    @divulgaciones = memoria.articulo_de_divulgacions
    @patentes = memoria.patentes
    @intelectuales = Patente.joins(:memorias).where(memorias: { id: memoria.id }, tipo: "Propiedad Intelectual")
    @industriales = Patente.joins(:memorias).where(memorias: { id: memoria.id }, tipo: "Propiedad Industrial")
    p = Axlsx::Package.new
    wb = p.workbook

    wb.font_scale_divisor = 11.5
    wb.bold_font_multiplier = 1.05
    st = wb.styles

    header = st.add_style bg_color: "FBE4D5", sz: 15, b: true, alignment: { horizontal: :center }, border: { style: :thin, color: "000000" }
    subheader = st.add_style bg_color: "FBE4D5", sz: 11, b: true, border: { style: :thin, color: "000000" }
    subheader_y = st.add_style bg_color: "FFFF00", sz: 11, b: true, border: { style: :thin, color: "000000" }
    focused = st.add_style sz: 11, b: true, border: { style: :thin, color: "000000" }
    centered = st.add_style sz: 11, alignment: { horizontal: :center, vertical: :center }


    flex_rows_to_merge = []
    three_part_rows_to_merge = []
    empty_rows_to_merge = []
    wb.add_worksheet(name: "Hoja1") do |s|
      flex_rows_to_merge.push(s.add_row [ "MEMORIAS " << memoria.anio << " DEL GRUPO " << grupo.nombre ], style: header)
      flex_rows_to_merge.push(s.add_row [ "I.- ADMINISTRACIÓN" ], style: subheader)
      flex_rows_to_merge.push(s.add_row [ "1.- INDIVIDUALIZACIÓN DEL GRUPO UTN" ], style: subheader)
      flex_rows_to_merge.push(s.add_row [ "1.1.- Facultad Regional: #{grupo.facultad_regional.nombre}" ], style: focused)
      flex_rows_to_merge.push(s.add_row [ "1.2.- Nombre y Sigla: #{grupo.nombre} #{grupo.sigla}" ], style: focused)
      flex_rows_to_merge.push(s.add_row [ "1.3.- Director/a: #{director.nombre} #{director.apellido}" ], style: focused)
      flex_rows_to_merge.push(s.add_row [ "1.4.- Vicedirector/a: #{vicedirector.nombre} #{vicedirector.apellido}" ], style: focused)
      flex_rows_to_merge.push(s.add_row [ "1.5.- Dirección de Email: #{grupo.correo_electronico}" ], style: focused)
      flex_rows_to_merge.push(s.add_row [ "1.6.- Integrantes del Consejo Ejecutivo ( NO APLICA )" ], style: focused)
      three_part_rows_to_merge.push(s.add_row [ "Nº", "Nombre y Apellido", "", "Cargo" ], style: focused)
      three_part_rows_to_merge.push(s.add_row [ "1" ], style: focused, types: [ :string ])
      three_part_rows_to_merge.push(s.add_row [ "2" ], style: focused, types: [ :string ])
      three_part_rows_to_merge.push(s.add_row [ "3" ], style: focused, types: [ :string ])
      three_part_rows_to_merge.push(s.add_row [ "4" ], style: focused, types: [ :string ])
      s.add_row
      s.add_row
      flex_rows_to_merge.push(s.add_row [ "1.7.- Organigrama Científico y Tecnológico y administrativo" ], style: subheader)
      s.add_row
      # TODO: completar organigrama
      flex_rows_to_merge.push(s.add_row [ "1.8- Objetivos y desarrollo ( en no más de 200 palabras):" ], style: subheader_y)
      s.add_row
      flex_rows_to_merge.push(s.add_row [ "2.- PERSONAL" ], style: subheader_y)
      flex_rows_to_merge.push(s.add_row [ "2.1.- Investigadores" ], style: subheader_y)
      s.add_row [ "Nº", "Nombre y Apellido", "Categoría UTN", "Prog. de Incentivos", "Dedicación" "Horas semanales" ], style: subheader
      s.add_row
      flex_rows_to_merge.push(s.add_row [ "2.2.- Personal Profesional" ], style: subheader_y)
      s.add_row [ "Nº", "Nombre y Apellido", "Horas semanales" ], style: subheader
      s.add_row
      flex_rows_to_merge.push(s.add_row [ "2.3.- Personal técnico, administrativo y de apoyo" ], style: subheader_y)
      s.add_row [ "Nº", "Nombre y Apellido", "Horas semanales" ], style: subheader
      s.add_row
      flex_rows_to_merge.push(s.add_row [ "2.4.- Becarios y/o personal en formación" ], style: subheader_y)
      flex_rows_to_merge.push(s.add_row [ "Doctorado" ], style: subheader_y)
      s.add_row [ "Nº", "Nombre y Apellido", "F. Financiamiento", "Horas semanales" ], style: subheader
      s.add_row
      flex_rows_to_merge.push(s.add_row [ "Maestría/Especialización (EN CURSO)" ], style: subheader_y)
      s.add_row [ "Nº", "Nombre y Apellido", "F. Financiamiento", "Horas semanales" ], style: subheader
      s.add_row
      flex_rows_to_merge.push(s.add_row [ "Becario Graduado" ], style: subheader_y)
      s.add_row [ "Nº", "Nombre y Apellido", "F. Financiamiento", "Horas semanales" ], style: subheader
      s.add_row
      flex_rows_to_merge.push(s.add_row [ "Becarios Alumnos" ], style: subheader_y)
      s.add_row [ "Nº", "Nombre y Apellido", "F. Financiamiento", "Horas semanales" ], style: subheader
      s.add_row
      flex_rows_to_merge.push(s.add_row [ "Pasantes" ], style: subheader_y)
      s.add_row [ "Nº", "Nombre y Apellido", "F. Financiamiento", "Horas semanales" ], style: subheader
      s.add_row
      flex_rows_to_merge.push(s.add_row [ "Proyectos Finales y Tesinas de Grado / Trabajos Finales y Tesis de Posgrado." ], style: subheader_y)
      s.add_row [ "Nº", "Nombre y Apellido", "F. Financiamiento", "Horas semanales" ], style: subheader
      s.add_row
      flex_rows_to_merge.push(s.add_row [ "3.- EQUIPAMIENTO E INFRAESTRUCTURA" ], style: subheader_y)
      s.add_row [ "Nº", "Denominación", "Fecha de incorporación", "Monto invertido", "Descripción breve" ], style: subheader
      s.add_row
      flex_rows_to_merge.push(s.add_row [ "4.- DOCUMENTACIÓN Y BIBLIOTECA" ], style: subheader_y)
      s.add_row [ "Nº", "Titulo", "Autores", "Editorial", "Año" ], style: subheader
      s.add_row
      flex_rows_to_merge.push(s.add_row [ "II.- ACTIVIDADES DE I+D+i" ], style: subheader_y)
      flex_rows_to_merge.push(s.add_row [ "5.- INVESTIGACIONES" ], style: subheader_y)
      flex_rows_to_merge.push(s.add_row [ "Proyectos en curso" ], style: subheader_y)
      s.add_row [ "5.1.- Tipo de Proyecto", "5.2.-Código de Proyecto", "5.3.- Fecha de inicio y Finalización", "5.4.- Nombre del Proyecto:", "5.5 .- Breve descripción del Proyecto", "5.6.- Logros obtenidos", "5.7.- Dificultades", "5.8.- Fuente de financiamiento" ], style: subheader
      s.add_row
      flex_rows_to_merge.push(s.add_row [ "6.1.- Distinciones recibidas:" ], style: subheader)
      s.add_row
      flex_rows_to_merge.push(s.add_row [ "6.1.- Participaciones: " ], style: subheader)
      s.add_row
      flex_rows_to_merge.push(s.add_row [ "6.2.- Visitantes del país y del extranjero: no aplica" ], style: subheader)
      s.add_row
      flex_rows_to_merge.push(s.add_row [ "7.- TRABAJOS PRESENTADOS EN CONGRESOS Y REUNIONES CIENTÍFICAS CON REFERATO" ], style: subheader_y)
      flex_rows_to_merge.push(s.add_row [ "7.1.- Reunión Científica Nacional con Referato" ], style: subheader_y)
      s.add_row [ "Nº", "Nombre Reunión", "Ciudad", "Fecha inicio", "Expositor", "Título trabajo" ], style: subheader
      s.add_row
      flex_rows_to_merge.push(s.add_row [ "7.2.- Reunión Científica Internacional" ], style: subheader_y)
      s.add_row [ "Nº", "Nombre Reunión", "País", "Fecha inicio", "Expositor", "Título trabajo" ], style: subheader
      s.add_row
      flex_rows_to_merge.push(s.add_row [ "8.- TRABAJOS REALIZADOS Y PUBLICADOS" ], style: subheader_y)
      flex_rows_to_merge.push(s.add_row [ "8.1.- Trabajos publicados en revistas con referato" ], style: subheader)
      if @revistas.empty?
        empty_rows_to_merge.push(s.add_row [ "No tuvimos en este período" ], style: centered)
        s.add_row [], style: centered
      else
        s.add_row [ "Nº", "Nombre de la revista", "País", "Editorial", "ISSN", "Título del trabajo" ], style: subheader
        @revistas.each_with_index do |t, idx|
          s.add_row [ (idx + 1).to_s, t.revista.nombre, t.revista.pais.nombre, t.revista.editorial, t.revista.issn, t.titulo ], types: [ :string ]
        end
      end
      s.add_row
      s.add_row
      flex_rows_to_merge.push(s.add_row [ "8.3.- Libros o capítulos de libros" ], style: subheader)
      if @libros.empty?
        empty_rows_to_merge.push(s.add_row [ "No tuvimos en este período" ], style: centered)
        s.add_row [], style: centered
      else
        s.add_row [ "Nº", "Nombre del libro", "Capitulo", "Título del trabajo" ], style: subheader
        @libros.each_with_index do |t, idx|
          s.add_row [ (idx + 1).to_s, t.libro, t.capitulo, t.titulo ], types: [ :string, nil, :string, nil ]
        end
      end
      s.add_row
      flex_rows_to_merge.push(s.add_row [ "8.4.- Artículos de divulgación, informes y memorias técnicas" ], style: subheader)
      if @divulgaciones.empty?
        empty_rows_to_merge.push(s.add_row [ "No tuvimos en este período" ], style: centered)
        s.add_row [], style: centered
      else
        s.add_row [ "Nº", "Nombre del artículo", "Título del trabajo" ], style: subheader
        @divulgaciones.each_with_index do |t, idx|
          s.add_row [ (idx + 1).to_s, t.nombre, t.titulo ], types: [ :string ]
        end
      end
      s.add_row
      flex_rows_to_merge.push(s.add_row [ "8.5.- Patentes, desarrollos y certificados de aptitud técnica" ], style: subheader)
      if @patentes.empty?
        empty_rows_to_merge.push(s.add_row [ "No tuvimos en este período" ], style: centered)
        s.add_row [], style: centered
      else
        s.add_row [ "Nº", "Numero Identificador", "Tipo de Patente", "Título del trabajo" ], style: subheader
        @patentes.each_with_index do |t, idx|
          s.add_row [ (idx + 1).to_s, t.identificador, t.tipo, t.titulo ], types: [ :string ]
        end
      end
      s.add_row
      flex_rows_to_merge.push(s.add_row [ "9.- REGISTROS Y PATENTES" ], style: subheader_y)
      flex_rows_to_merge.push(s.add_row [ "9.1.- Registro de Propiedad Intelectual" ], style: subheader_y)
      if @intelectuales.empty?
        empty_rows_to_merge.push(s.add_row [ "No tuvimos en este período" ], style: centered)
        s.add_row [], style: centered
      else
        s.add_row [ "Nº", "Numero Identificador", "Título del trabajo" ], style: subheader
        @intelectuales.each_with_index do |t, idx|
          s.add_row [ (idx + 1).to_s, t.identificador, t.titulo ], types: [ :string ]
        end
      end
      s.add_row
      flex_rows_to_merge.push(s.add_row [ "9.2.- Registro de Propiedad Industrial" ], style: subheader_y)
      if @industriales.empty?
        empty_rows_to_merge.push(s.add_row [ "No tuvimos en este período" ], style: centered)
        s.add_row [], style: centered
      else
        s.add_row [ "Nº", "Numero Identificador", "Título del trabajo" ], style: subheader
        @industriales.each_with_index do |t, idx|
          s.add_row [ (idx + 1).to_s, t.identificador, t.titulo ], types: [ :string ]
        end
      end
      s.add_row
      flex_rows_to_merge.push(s.add_row [ "III.- ACTIVIDADES EN DOCENCIA" ], style: subheader_y)
      s.add_row [ "Nº", "Investigador", "Grado", "", "Actividades y Cátedras de Posgrado" ], style: subheader
      s.add_row
      flex_rows_to_merge.push(s.add_row [ "IV.- VINCULACIÓN CON EL MEDIO SOCIO PRODUCTIVO" ], style: subheader_y)
      flex_rows_to_merge.push(s.add_row [ "10.- TRANSFERENCIA AL MEDIO SOCIO PRODUCTIVO" ], style: subheader_y)
      flex_rows_to_merge.push(s.add_row [ "10.1.- Contrato de transferencia de tecnología" ], style: subheader)
      tmp = s.add_row [ "Nº", "Denominación", "", "Adoptante", "", "Demandante" ], style: subheader
      s.merge_cells("B%i:C%i" % [ tmp.row_index+1, tmp.row_index+1 ])
      s.merge_cells("D%i:E%i" % [ tmp.row_index+1, tmp.row_index+1 ])
      s.add_row
      s.add_row
      flex_rows_to_merge.push(s.add_row [ "10.2.- Contrato de I+D+i" ], style: subheader)
      tmp = s.add_row [ "Nº", "Denominación", "", "Adoptante", "", "Demandante" ], style: subheader
      s.merge_cells("B%i:C%i" % [ tmp.row_index+1, tmp.row_index+1 ])
      s.merge_cells("D%i:E%i" % [ tmp.row_index+1, tmp.row_index+1 ])
      s.add_row
      flex_rows_to_merge.push(s.add_row [ "10.3.- Contrato/Acuerdo de Transferencia de conocimientos" ], style: subheader)
      tmp = s.add_row [ "Nº", "Denominación", "", "Adoptante", "", "Demandante" ], style: subheader
      s.merge_cells("B%i:C%i" % [ tmp.row_index+1, tmp.row_index+1 ])
      s.merge_cells("D%i:E%i" % [ tmp.row_index+1, tmp.row_index+1 ])
      s.add_row
      flex_rows_to_merge.push(s.add_row [ "10.4.- Contrato de Asistencia Técnica o Consultoría" ], style: subheader)
      tmp = s.add_row [ "Nº", "Denominación", "", "Adoptante", "", "Demandante" ], style: subheader
      s.merge_cells("B%i:C%i" % [ tmp.row_index+1, tmp.row_index+1 ])
      s.merge_cells("D%i:E%i" % [ tmp.row_index+1, tmp.row_index+1 ])
      s.add_row
      flex_rows_to_merge.push(s.add_row [ "10.5.- Servicios técnicos/de apoyo/supervisión y/o ensayos de laboratorio: breve descripción" ], style: subheader)
      tmp = s.add_row [ "Nº", "Denominación", "", "Adoptante", "", "Demandante" ], style: subheader
      s.merge_cells("B%i:C%i" % [ tmp.row_index+1, tmp.row_index+1 ])
      s.merge_cells("D%i:E%i" % [ tmp.row_index+1, tmp.row_index+1 ])
      s.add_row
      flex_rows_to_merge.push(s.add_row [ "10.6.- Difusión a la comunidad académica y en general: breve descripción" ], style: subheader)
      tmp = s.add_row [ "Nº", "Denominación", "", "Adoptante", "", "Demandante" ], style: subheader
      s.merge_cells("B%i:C%i" % [ tmp.row_index+1, tmp.row_index+1 ])
      s.merge_cells("D%i:E%i" % [ tmp.row_index+1, tmp.row_index+1 ])
      s.add_row
      flex_rows_to_merge.push(s.add_row [ "V.- INFORME SOBRE RENDICIÓN GENERAL DE CUENTAS" ], style: subheader_y)
      flex_rows_to_merge.push(s.add_row [ "11.- RESUMEN DE INGRESOS Y EGRESOS" ], style: subheader)
      flex_rows_to_merge.push(s.add_row [ "Erogaciones Corrientes" ], style: subheader)
      tmp = s.add_row [ "Nº", "Fuente de Financiamiento", "Ingresos", "", "Egresos", "" ], style: subheader
      s.merge_cells("C%i:D%i" % [ tmp.row_index+1, tmp.row_index+1 ])
      s.merge_cells("E%i:F%i" % [ tmp.row_index+1, tmp.row_index+1 ])
      s.add_row
      flex_rows_to_merge.push(s.add_row [ "Erogaciones de Capital" ], style: subheader)
      tmp = s.add_row [ "Nº", "Fuente de Financiamiento", "Ingresos", "", "Egresos", "" ], style: subheader
      s.merge_cells("C%i:D%i" % [ tmp.row_index+1, tmp.row_index+1 ])
      s.merge_cells("E%i:F%i" % [ tmp.row_index+1, tmp.row_index+1 ])
      s.add_row
      flex_rows_to_merge.push(s.add_row [ "VI - PROGRAMA DE ACTIVIDADES para 2025" ], style: subheader_y)
      s.add_row

      flex_rows_to_merge.each { |row| s.merge_cells("A%i:F%i" % [ row.row_index+1, row.row_index+1 ]) }
      three_part_rows_to_merge.each { |row|
        s.merge_cells("B%i:C%i" % [ row.row_index+1, row.row_index+1 ])
        s.merge_cells("D%i:F%i" % [ row.row_index+1, row.row_index+1 ])
      }
      empty_rows_to_merge.each { |row|
        s.merge_cells("A%i:F%i" % [ row.row_index+1, row.row_index+2 ])
      }
      s.column_widths 20, nil, nil, nil, nil, nil
    end
    stream = p.to_stream
    nombre = "Informe_I+D+i_Grupo_" << grupo.nombre << "_Anio_" << memoria.anio << ".xlsx"
    send_data stream, filename: nombre, type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet; charset=utf-8"
  end
end
