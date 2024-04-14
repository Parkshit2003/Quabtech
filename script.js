// Function to format numbers with commas and two decimal places
function formatNumber(num) {
    return num.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  }

  document.addEventListener('DOMContentLoaded', function() {
    const dropdownContent = document.getElementById('dropdownContent');
    const selectedDataDiv = document.getElementById('selectedData');
    const modeSwitch = document.getElementById('modeSwitch'); // Reference to the mode switch

    // Function to toggle dark/light mode
    function toggleDarkMode() {
      const body = document.body;
      body.classList.toggle('dark-mode');
    }
    toggleDarkMode();

    modeSwitch.addEventListener('change', function() {
      toggleDarkMode();
    });

    fetch('http://localhost:3000/api/tickers')
      .then(response => response.json())
      .then(data => {
        const table = document.getElementById('tickerTable');
        let serialNumber = 1;
        let highestVolumeItem; // Variable to store the item with the highest volume

        data.forEach(item => {
          const row = table.insertRow();
          row.insertCell().textContent = serialNumber++;
          row.insertCell().textContent = item.name;
          row.insertCell().textContent = formatNumber(item.last);
          row.insertCell().textContent = `${formatNumber(item.buy)} / ${formatNumber(item.sell)}`;
          row.insertCell().textContent = formatNumber(item.volume);
          row.insertCell().textContent = item.base_unit;

          // Add option to dropdown for each name
          const option = document.createElement('option');
          option.textContent = item.name;
          dropdownContent.appendChild(option);

          // Check if this item has higher volume than the previous highest volume item
          if (!highestVolumeItem || item.volume > highestVolumeItem.volume) {
            highestVolumeItem = item;
          }
        });

        // Set the default selected option to the one with the highest volume
        dropdownContent.value = highestVolumeItem.name;

   

        // Display data for the initially selected option
        selectedDataDiv.innerHTML = `
          <p>${highestVolumeItem.name}</p>
          <p>Last: ${formatNumber(highestVolumeItem.last)}</p>
          <h2>Best Price To Trade: <br/>${formatNumber(highestVolumeItem.sell)}</h2>
          <p>Volume: ${formatNumber(highestVolumeItem.volume)}</p>
          <p>Base: ${highestVolumeItem.base_unit}</p>
        `;

        // Event listener for dropdown selection
        dropdownContent.addEventListener('change', function(event) {
          const dropdownContent = event.target.value;
          const selectedData = data.find(item => item.name === dropdownContent);
          if (selectedData) {
            selectedDataDiv.innerHTML = `
              <p>${selectedData.name}<p>
              <p>Last: ${formatNumber(selectedData.last)}</p>
              <h2>Best Price To Trade:<br/>${formatNumber(selectedData.sell)}</h2>
              <p>Volume: ${formatNumber(selectedData.volume)}</p>
              <p>Base: ${selectedData.base_unit}</p>
            `;
            // Update button text when an option is selected
            selectedNameBtn.textContent = selectedData.name;
          } else {
            selectedDataDiv.innerHTML = '';
          }
        });
      })
      .catch(error => console.error('Error:', error));
  });




  const timerTextElement = document.querySelector('.timer-text');
  const circle = document.querySelector('.progress-ring__circle');
  const radius = circle.r.baseVal.value;
  const circumference = 2 * Math.PI * radius;
  
  let timeLeft = 60;
  
  function setProgress(percent) {
    const offset = circumference - (percent / 100) * circumference;
    circle.style.strokeDashoffset = offset;
  }
  
  function countdown() {
    if (timeLeft >= 0) {
      const progress = (timeLeft / 60) * 100;
      setProgress(progress);
      timerTextElement.textContent = timeLeft;
      timeLeft--;
      setTimeout(countdown, 1000);
    } else {
      timeLeft = 60;
      countdown(); // Restart the countdown
    }
  }
  
  countdown();
  