require "test_helper"

class PublicacionEnLibrosControllerTest < ActionDispatch::IntegrationTest
  setup do
    @publicacion_en_libro = publicacion_en_libros(:one)
  end

  test "should get index" do
    get publicacion_en_libros_url, as: :json
    assert_response :success
  end

  test "should create publicacion_en_libro" do
    assert_difference("PublicacionEnLibro.count") do
      post publicacion_en_libros_url, params: { publicacion_en_libro: { capitulo: @publicacion_en_libro.capitulo, codigo: @publicacion_en_libro.codigo, libro: @publicacion_en_libro.libro, titulo: @publicacion_en_libro.titulo } }, as: :json
    end

    assert_response :created
  end

  test "should show publicacion_en_libro" do
    get publicacion_en_libro_url(@publicacion_en_libro), as: :json
    assert_response :success
  end

  test "should update publicacion_en_libro" do
    patch publicacion_en_libro_url(@publicacion_en_libro), params: { publicacion_en_libro: { capitulo: @publicacion_en_libro.capitulo, codigo: @publicacion_en_libro.codigo, libro: @publicacion_en_libro.libro, titulo: @publicacion_en_libro.titulo } }, as: :json
    assert_response :success
  end

  test "should destroy publicacion_en_libro" do
    assert_difference("PublicacionEnLibro.count", -1) do
      delete publicacion_en_libro_url(@publicacion_en_libro), as: :json
    end

    assert_response :no_content
  end
end
