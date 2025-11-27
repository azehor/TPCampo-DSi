class Memoria < ApplicationRecord
  has_and_belongs_to_many :patentes

  has_and_belongs_to_many :trabajo_en_revistas,
                          class_name: "TrabajoEnRevista",
                          join_table: "memorias_trabajo_en_revistas"

  has_and_belongs_to_many :publicacion_en_libros,
                          class_name: "PublicacionEnLibro",
                          join_table: "memorias_publicacion_en_libros"

  has_and_belongs_to_many :articulo_de_divulgacions,
                          class_name: "ArticuloDeDivulgacion",
                          join_table: "memorias_articulo_de_divulgacions"
end
