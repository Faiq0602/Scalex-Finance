
        document.getElementById('show-data-btn').addEventListener('click', async () => {
            try {
                const response = await fetch('http://localhost:3000/showData');
                const data = await response.json();
                renderData(data);
            } catch (error) {
                console.error('Error:', error);
                alert('Failed to fetch data. Please try again.');
            }
        });

        document.getElementById('add-data-btn').addEventListener('click', async () => {
            try {
                const response = await fetch('http://localhost:3000/addData');
                const responseData = await response.json();
                const newData = responseData.pairsData;

                // Display success message
                const successMessage = document.querySelector('.success-message');
                if (!successMessage) {
                    const newSuccessMessage = document.createElement('p');
                    newSuccessMessage.classList.add('success-message');
                    newSuccessMessage.textContent = 'New data added successfully.';
                    newSuccessMessage.style.color = 'green';
                    document.querySelector('.container').appendChild(newSuccessMessage);
                } else {
                    successMessage.textContent = 'New data added successfully.';
                    successMessage.style.color = 'green';
                }

                // Render the new data
                renderData(newData);
            } catch (error) {
                console.error('Error:', error);
                alert('Failed to add data. Please try again.');
            }
        });

        document.getElementById('delete-data-btn').addEventListener('click', async () => {
            try {
                const response = await fetch('http://localhost:3000/deleteData');
                const responseData = await response.text();
                alert(responseData);
                renderData([]);
            } catch (error) {
                console.error('Error:', error);
                alert('Failed to delete data. Please try again.');
            }
        });

        document.getElementById('update-data-btn').addEventListener('click', () => {
            // Open new window with update form
            window.open('update_form.html', '_blank');
        });

        function renderData(data) {
            const dataContainer = document.getElementById('data-container');
            dataContainer.innerHTML = '';
            if (data.length === 0) {
                dataContainer.innerHTML = '<p>No data present.</p>';
                return;
            }

            data.forEach(pair => {
                const pairElement = document.createElement('div');
                pairElement.classList.add('pair');
                pairElement.innerHTML = `
                    <p>Pair Address: ${pair.pairAddress}</p>
                    <p>Price USD: ${pair.priceUsd}</p>
                    <p>Volume: ${pair.volume}</p>
                    <hr>
                `;
                dataContainer.appendChild(pairElement);
            });
        }
