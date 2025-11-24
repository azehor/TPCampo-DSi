require "test_helper"

class TrabajoEnRevistaControllerTest < ActionDispatch::IntegrationTest
  setup do
    @trabajo_en_revistum = trabajo_en_revista(:one)
  end

  test "should get index" do
    get trabajo_en_revista_index_url, as: :json
    assert_response :success
  end

  test "should create trabajo_en_revistum" do
    assert_difference("TrabajoEnRevista.count") do
      post trabajo_en_revista_index_url, params: { trabajo_en_revistum: {} }, as: :json
    end

    assert_response :created
  end

  test "should show trabajo_en_revistum" do
    get trabajo_en_revistum_url(@trabajo_en_revistum), as: :json
    assert_response :success
  end

  test "should update trabajo_en_revistum" do
    patch trabajo_en_revistum_url(@trabajo_en_revistum), params: { trabajo_en_revistum: {} }, as: :json
    assert_response :success
  end

  test "should destroy trabajo_en_revistum" do
    assert_difference("TrabajoEnRevista.count", -1) do
      delete trabajo_en_revistum_url(@trabajo_en_revistum), as: :json
    end

    assert_response :no_content
  end
end
