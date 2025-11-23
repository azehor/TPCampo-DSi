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

ActiveRecord::Schema[8.1].define(version: 2025_11_23_212406) do
  # These are extensions that must be enabled in order to support this database
  enable_extension "pg_catalog.plpgsql"

  create_table "facultad_regionals", force: :cascade do |t|
    t.datetime "created_at", null: false
    t.string "nombre", null: false
    t.datetime "updated_at", null: false
  end

  create_table "grupo_de_investigacions", force: :cascade do |t|
    t.string "correo_electronico", null: false
    t.datetime "created_at", null: false
    t.integer "director_id", null: false
    t.bigint "facultad_regional_id", null: false
    t.integer "integrantes", null: false
    t.string "nombre", null: false
    t.text "objetivos", null: false
    t.string "sigla", null: false
    t.datetime "updated_at", null: false
    t.integer "vicedirector_id", null: false
    t.index ["facultad_regional_id"], name: "index_grupo_de_investigacions_on_facultad_regional_id"
  end

  create_table "investigadors", force: :cascade do |t|
    t.string "categoria", null: false
    t.datetime "created_at", null: false
    t.string "dedicacion", null: false
    t.bigint "personal_id", null: false
    t.datetime "updated_at", null: false
    t.index ["personal_id"], name: "index_investigadors_on_personal_id"
  end

  create_table "pais", force: :cascade do |t|
    t.string "codigo"
    t.datetime "created_at", null: false
    t.string "nombre"
    t.datetime "updated_at", null: false
  end

  create_table "personals", force: :cascade do |t|
    t.string "apellido", limit: 45, null: false
    t.datetime "created_at", null: false
    t.integer "horas_semanales"
    t.string "nombre", limit: 45, null: false
    t.string "object_type", limit: 45, null: false
    t.datetime "updated_at", null: false
  end

  create_table "users", force: :cascade do |t|
    t.datetime "created_at", null: false
    t.string "email", null: false
    t.string "password_digest", null: false
    t.string "role", null: false
    t.datetime "updated_at", null: false
  end

  add_foreign_key "grupo_de_investigacions", "facultad_regionals"
  add_foreign_key "grupo_de_investigacions", "investigadors", column: "director_id"
  add_foreign_key "grupo_de_investigacions", "investigadors", column: "vicedirector_id"
  add_foreign_key "investigadors", "personals"
end
