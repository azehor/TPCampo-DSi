require "test_helper"

class ArticuloDeDivulgacionsControllerTest < ActionDispatch::IntegrationTest
  setup do
    @articulo_de_divulgacion = articulo_de_divulgacions(:one)
  end

  test "should get index" do
    get articulo_de_divulgacions_url, as: :json
    assert_response :success
  end

  test "should create articulo_de_divulgacion" do
    assert_difference("ArticuloDeDivulgacion.count") do
      post articulo_de_divulgacions_url, params: { articulo_de_divulgacion: { codigo: @articulo_de_divulgacion.codigo, nombre: @articulo_de_divulgacion.nombre, titulo: @articulo_de_divulgacion.titulo } }, as: :json
    end

    assert_response :created
  end

  test "should show articulo_de_divulgacion" do
    get articulo_de_divulgacion_url(@articulo_de_divulgacion), as: :json
    assert_response :success
  end

  test "should update articulo_de_divulgacion" do
    patch articulo_de_divulgacion_url(@articulo_de_divulgacion), params: { articulo_de_divulgacion: { codigo: @articulo_de_divulgacion.codigo, nombre: @articulo_de_divulgacion.nombre, titulo: @articulo_de_divulgacion.titulo } }, as: :json
    assert_response :success
  end

  test "should destroy articulo_de_divulgacion" do
    assert_difference("ArticuloDeDivulgacion.count", -1) do
      delete articulo_de_divulgacion_url(@articulo_de_divulgacion), as: :json
    end

    assert_response :no_content
  end
end
