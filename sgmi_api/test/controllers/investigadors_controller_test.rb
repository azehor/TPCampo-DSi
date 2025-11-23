require "test_helper"

class InvestigadorsControllerTest < ActionDispatch::IntegrationTest
  test "should get index" do
    get investigadors_index_url
    assert_response :success
  end

  test "should get show" do
    get investigadors_show_url
    assert_response :success
  end

  test "should get create" do
    get investigadors_create_url
    assert_response :success
  end

  test "should get update" do
    get investigadors_update_url
    assert_response :success
  end

  test "should get destroy" do
    get investigadors_destroy_url
    assert_response :success
  end
end
