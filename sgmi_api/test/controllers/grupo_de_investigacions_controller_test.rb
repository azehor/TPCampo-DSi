require "test_helper"

class GrupoDeInvestigacionsControllerTest < ActionDispatch::IntegrationTest
  test "should get index" do
    get grupo_de_investigacions_index_url
    assert_response :success
  end

  test "should get show" do
    get grupo_de_investigacions_show_url
    assert_response :success
  end

  test "should get create" do
    get grupo_de_investigacions_create_url
    assert_response :success
  end

  test "should get update" do
    get grupo_de_investigacions_update_url
    assert_response :success
  end

  test "should get destroy" do
    get grupo_de_investigacions_destroy_url
    assert_response :success
  end
end
