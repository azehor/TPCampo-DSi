require "test_helper"

class PatentesControllerTest < ActionDispatch::IntegrationTest
  setup do
    @patente = patentes(:one)
  end

  test "should get index" do
    get patentes_url, as: :json
    assert_response :success
  end

  test "should create patente" do
    assert_difference("Patente.count") do
      post patentes_url, params: { patente: { identificador: @patente.identificador, tipo: @patente.tipo, titulo: @patente.titulo } }, as: :json
    end

    assert_response :created
  end

  test "should show patente" do
    get patente_url(@patente), as: :json
    assert_response :success
  end

  test "should update patente" do
    patch patente_url(@patente), params: { patente: { identificador: @patente.identificador, tipo: @patente.tipo, titulo: @patente.titulo } }, as: :json
    assert_response :success
  end

  test "should destroy patente" do
    assert_difference("Patente.count", -1) do
      delete patente_url(@patente), as: :json
    end

    assert_response :no_content
  end
end
