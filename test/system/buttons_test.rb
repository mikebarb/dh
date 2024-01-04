require "application_system_test_case"

class ButtonsTest < ApplicationSystemTestCase
  setup do
    @button = buttons(:one)
  end

  test "visiting the index" do
    visit buttons_url
    assert_selector "h1", text: "Buttons"
  end

  test "should create button" do
    visit buttons_url
    click_on "New button"

    fill_in "Enable", with: @button.enable
    fill_in "Group", with: @button.group
    fill_in "Name", with: @button.name
    fill_in "Seq", with: @button.seq
    click_on "Create Button"

    assert_text "Button was successfully created"
    click_on "Back"
  end

  test "should update Button" do
    visit button_url(@button)
    click_on "Edit this button", match: :first

    fill_in "Enable", with: @button.enable
    fill_in "Group", with: @button.group
    fill_in "Name", with: @button.name
    fill_in "Seq", with: @button.seq
    click_on "Update Button"

    assert_text "Button was successfully updated"
    click_on "Back"
  end

  test "should destroy Button" do
    visit button_url(@button)
    click_on "Destroy this button", match: :first

    assert_text "Button was successfully destroyed"
  end
end
