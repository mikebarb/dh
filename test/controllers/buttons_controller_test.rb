require "test_helper"

class ButtonsControllerTest < ActionDispatch::IntegrationTest
  setup do
    @button = buttons(:one)
  end

  test "should get index" do
    get buttons_url
    assert_response :success
  end

  test "should get new" do
    get new_button_url
    assert_response :success
  end

  test "should create button" do
    assert_difference("Button.count") do
      post buttons_url, params: { button: { enable: @button.enable, group: @button.group, name: @button.name, seq: @button.seq } }
    end

    assert_redirected_to button_url(Button.last)
  end

  test "should show button" do
    get button_url(@button)
    assert_response :success
  end

  test "should get edit" do
    get edit_button_url(@button)
    assert_response :success
  end

  test "should update button" do
    patch button_url(@button), params: { button: { enable: @button.enable, group: @button.group, name: @button.name, seq: @button.seq } }
    assert_redirected_to button_url(@button)
  end

  test "should destroy button" do
    assert_difference("Button.count", -1) do
      delete button_url(@button)
    end

    assert_redirected_to buttons_url
  end
end
