require "test_helper"

class PersonalsControllerTest < ActionDispatch::IntegrationTest
  test "should get index" do
    get personals_index_url
    assert_response :success
  end

  test "should get show" do
    get personals_show_url
    assert_response :success
  end

  test "should get create" do
    get personals_create_url
    assert_response :success
  end

  test "should get update" do
    get personals_update_url
    assert_response :success
  end

  test "should get destroy" do
    get personals_destroy_url
    assert_response :success
  end
end
