// LaunchBar Action Script

include('functions.js');

function run(argument) {
    if (argument == undefined) {
        // Inform the user that there was no argument
        LaunchBar.alert('No argument was passed to the action');
    } else {
        return searchName(argument, 5);
    }
}
