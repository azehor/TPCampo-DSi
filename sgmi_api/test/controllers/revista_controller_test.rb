require "test_helper"

class RevistaControllerTest < ActionDispatch::IntegrationTest
  setup do
    @revistum = revista(:one)
  end

  test "should get index" do
    get revista_index_url, as: :json
    assert_response :success
  end

  test "should create revistum" do
    assert_difference("Revista.count") do
      post revista_index_url, params: { revistum: {} }, as: :json
    end

    assert_response :created
  end

  test "should show revistum" do
    get revistum_url(@revistum), as: :json
    assert_response :success
  end

  test "should update revistum" do
    patch revistum_url(@revistum), params: { revistum: {} }, as: :json
    assert_response :success
  end

  test "should destroy revistum" do
    assert_difference("Revista.count", -1) do
      delete revistum_url(@revistum), as: :json
    end

    assert_response :no_content
  end
end
