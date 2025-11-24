# This file is auto-generated from the current state of the database. Instead
# of editing this file, please use the migrations feature of Active Record to
# incrementally modify your database, and then regenerate this schema definition.
#
# This file is the source Rails uses to define your schema when running `bin/rails
# db:schema:load`. When creating a new database, `bin/rails db:schema:load` tends to
# be faster and is potentially less error prone than running all of your
# migrations from scratch. Old migrations may fail to apply correctly if those
# migrations use external dependencies or application code.
#
# It's strongly recommended that you check this file into your version control system.

ActiveRecord::Schema[8.1].define(version: 2025_11_24_232535) do
  # These are extensions that must be enabled in order to support this database
  enable_extension "pg_catalog.plpgsql"

  create_table "articulo_de_divulgacions", force: :cascade do |t|
    t.string "codigo"
    t.datetime "created_at", null: false
    t.bigint "grupo_de_investigacion_id", null: false
    t.string "nombre"
    t.string "titulo"
    t.datetime "updated_at", null: false
    t.index ["grupo_de_investigacion_id"], name: "index_articulo_de_divulgacions_on_grupo_de_investigacion_id"
  end

  create_table "facultad_regionals", force: :cascade do |t|
    t.datetime "created_at", null: false
    t.string "nombre", null: false
    t.datetime "updated_at", null: false
  end

  create_table "grupo_de_investigacions", force: :cascade do |t|
    t.string "correo_electronico", null: false
    t.datetime "created_at", null: false
    t.bigint "director_id", null: false
    t.bigint "facultad_regional_id", null: false
    t.integer "integrantes", null: false
    t.string "nombre", null: false
    t.text "objetivos"
    t.string "sigla", null: false
    t.datetime "updated_at", null: false
    t.bigint "vicedirector_id", null: false
    t.index ["director_id"], name: "index_grupo_de_investigacions_on_director_id"
    t.index ["facultad_regional_id"], name: "index_grupo_de_investigacions_on_facultad_regional_id"
    t.index ["vicedirector_id"], name: "index_grupo_de_investigacions_on_vicedirector_id"
  end

  create_table "investigadors", force: :cascade do |t|
    t.string "categoria", null: false
    t.datetime "created_at", null: false
    t.string "dedicacion", null: false
    t.bigint "personal_id", null: false
    t.integer "programa_incentivo"
    t.datetime "updated_at", null: false
    t.index ["personal_id"], name: "index_investigadors_on_personal_id"
  end

  create_table "pais", force: :cascade do |t|
    t.string "codigo", null: false
    t.datetime "created_at", null: false
    t.string "nombre", null: false
    t.datetime "updated_at", null: false
  end

  create_table "patentes", force: :cascade do |t|
    t.datetime "created_at", null: false
    t.bigint "grupo_de_investigacion_id", null: false
    t.string "identificador"
    t.string "tipo"
    t.string "titulo"
    t.datetime "updated_at", null: false
    t.index ["grupo_de_investigacion_id"], name: "index_patentes_on_grupo_de_investigacion_id"
  end

  create_table "personals", force: :cascade do |t|
    t.string "apellido", limit: 45, null: false
    t.datetime "created_at", null: false
    t.integer "horas_semanales"
    t.string "nombre", limit: 45, null: false
    t.string "object_type", limit: 45, null: false
    t.datetime "updated_at", null: false
  end

  create_table "publicacion_en_libros", force: :cascade do |t|
    t.string "capitulo"
    t.string "codigo"
    t.datetime "created_at", null: false
    t.bigint "grupo_de_investigacion_id", null: false
    t.string "libro"
    t.string "titulo"
    t.datetime "updated_at", null: false
    t.index ["grupo_de_investigacion_id"], name: "index_publicacion_en_libros_on_grupo_de_investigacion_id"
  end

  create_table "revista", force: :cascade do |t|
    t.datetime "created_at", null: false
    t.string "editorial", null: false
    t.string "issn", null: false
    t.string "nombre", null: false
    t.bigint "pais_id", null: false
    t.datetime "updated_at", null: false
    t.index ["pais_id"], name: "index_revista_on_pais_id"
  end

  create_table "trabajo_en_revista", force: :cascade do |t|
    t.string "codigo", null: false
    t.datetime "created_at", null: false
    t.bigint "grupo_de_investigacion_id", null: false
    t.bigint "revista_id", null: false
    t.string "titulo", null: false
    t.datetime "updated_at", null: false
    t.index ["grupo_de_investigacion_id"], name: "index_trabajo_en_revista_on_grupo_de_investigacion_id"
    t.index ["revista_id"], name: "index_trabajo_en_revista_on_revista_id"
  end

  create_table "users", force: :cascade do |t|
    t.datetime "created_at", null: false
    t.string "email", null: false
    t.string "password_digest", null: false
    t.string "role", null: false
    t.datetime "updated_at", null: false
  end

  add_foreign_key "articulo_de_divulgacions", "grupo_de_investigacions"
  add_foreign_key "grupo_de_investigacions", "facultad_regionals"
  add_foreign_key "grupo_de_investigacions", "investigadors", column: "director_id"
  add_foreign_key "grupo_de_investigacions", "investigadors", column: "vicedirector_id"
  add_foreign_key "investigadors", "personals"
  add_foreign_key "patentes", "grupo_de_investigacions"
  add_foreign_key "publicacion_en_libros", "grupo_de_investigacions"
  add_foreign_key "revista", "pais", column: "pais_id"
  add_foreign_key "trabajo_en_revista", "grupo_de_investigacions"
  add_foreign_key "trabajo_en_revista", "revista", column: "revista_id"
end
