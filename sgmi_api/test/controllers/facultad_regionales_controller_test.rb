require "test_helper"

class FacultadRegionalesControllerTest < ActionDispatch::IntegrationTest
  test "should get index" do
    get facultad_regionales_index_url
    assert_response :success
  end

  test "should get show" do
    get facultad_regionales_show_url
    assert_response :success
  end

  test "should get create" do
    get facultad_regionales_create_url
    assert_response :success
  end

  test "should get update" do
    get facultad_regionales_update_url
    assert_response :success
  end

  test "should get destroy" do
    get facultad_regionales_destroy_url
    assert_response :success
  end
end
