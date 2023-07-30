function updateContent(dropdownId) {
    // Retrieve the selected option from the first dropdown
    var selectedOption = document.getElementById(dropdownId).value;
    
    // Update the content of the second dropdown only when it's explicitly selected
    if (dropdownId === 'dropdown1') {
        var dropdown2 = document.getElementById('dropdown2');
        dropdown2.value = ''; // Reset the second dropdown's selection
    }

    // Submit the form to update the content based on the selected option
    document.getElementById('dropdown-form').submit();
}

function handleSubmit(event) {
    event.preventDefault(); 
}