require "test_helper"

class PaisControllerTest < ActionDispatch::IntegrationTest
  setup do
    @pai = pais(:one)
  end

  test "should get index" do
    get pais_url, as: :json
    assert_response :success
  end

  test "should create pai" do
    assert_difference("Pai.count") do
      post pais_url, params: { pai: { codigo: @pai.codigo, nombre: @pai.nombre } }, as: :json
    end

    assert_response :created
  end

  test "should show pai" do
    get pai_url(@pai), as: :json
    assert_response :success
  end

  test "should update pai" do
    patch pai_url(@pai), params: { pai: { codigo: @pai.codigo, nombre: @pai.nombre } }, as: :json
    assert_response :success
  end

  test "should destroy pai" do
    assert_difference("Pai.count", -1) do
      delete pai_url(@pai), as: :json
    end

    assert_response :no_content
  end
end
