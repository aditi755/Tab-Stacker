let myLeads = [ ]
const inputEl = document.getElementById("input-el")
const inputBtn = document.getElementById("input-btn")
const ulEl = document.getElementById("ul-el")
const deleteBtn = document.getElementById("delete-btn")
const leadsFromLocalStorage = JSON.parse( localStorage.getItem("myLeads") )
const tabBtn = document.getElementById("tab-btn")
const shareBtn = document.getElementById("share-btn")

if (leadsFromLocalStorage) {
    myLeads = leadsFromLocalStorage
    render(myLeads)
}

tabBtn.addEventListener("click", function(){    
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs){
        myLeads.push(tabs[0].url)
        localStorage.setItem("myLeads", JSON.stringify(myLeads) )
         render(myLeads)   
    })
})

  
function render(leads) {
    let listItems = "";
    for (let i = 0; i < leads.length; i++) {
      listItems += `
        <li>
          <a target='_blank' href='${leads[i]}' class="lead-item" data-key=${i}>
            ${leads[i]}
          </a>
          <button class="delete-one">Delete</button>
          <button class="share-one"  href="https://wa.me/?text=${encodeURIComponent(leads[i])}" >Share</button>
        </li>
      `;
    }
    ulEl.innerHTML = listItems;
  
    ulEl.addEventListener("click", function (event) {
      if (event.target.classList.contains("delete-one")) {
        const indexToRemove = event.target.previousElementSibling.getAttribute("data-key");
        console.log(indexToRemove)
        // // Remove the specific item from localStorage
        // localStorage.removeItem(keyToRemove);

        // Remove the specific item from the leads array ..do changes in existing array
      leads.splice(indexToRemove, 1);

      // Update localStorage after modifying the leads array
      localStorage.setItem('myLeads', JSON.stringify(leads));

    
        // Update the UI (remove the list item from DOM if needed)
        event.target.parentElement.remove();
      }
      else if (event.target.classList.contains("share-one")) {
        const urlToShare = event.target.getAttribute("href");
        window.open(urlToShare);
      }
    });
  }

deleteBtn.addEventListener("dblclick", function() {
    localStorage.clear()
    myLeads = []
    const w = render(myLeads)        //empty render, space remains of those list has bebn added
    console.log(w)
  })



inputBtn.addEventListener("click", function() {
    myLeads.push(inputEl.value)
    inputEl.value = ""
    localStorage.setItem("myLeads", JSON.stringify(myLeads) )
    render(myLeads)
})

shareBtn.addEventListener("click", shareViaWhatsApp);

function shareViaWhatsApp() {
    const tabsData = JSON.parse(localStorage.getItem("myLeads"));
    const formattedData = tabsData.join("\n"); // Format the data for sharing

    const encodedTabsData = encodeURIComponent(formattedData);
    const whatsappURL = `whatsapp://send?text=${encodedTabsData}`;

    window.open(whatsappURL);
    console.log("sharing via whatapp done")
}





// shareBtn.addEventListener("click", function() {
//     const collectedLinks = myLeads.filter(link => link.trim().startsWith('http')); // Filtering valid URLs
//     //const collectedLinks = myLeads; // Replace this with your collected links array
//     const combinedLinks = collectedLinks.join('\n');

//     const accessToken = '81656bb76873d34434811c09513c08b20a840ff5'; // Replace with your Bitly access token
//     const bitlyAPI = 'https://api-ssl.bitly.com/v4/shorten';

//     fetch(bitlyAPI, {
//         method: 'POST',
//         headers: {
//             'Authorization': `Bearer ${accessToken}`,
//             'Content-Type': 'application/json'
//         },
//         body: JSON.stringify({
//             long_url: combinedLinks
//         })
//     })
//     .then(response => response.json())
//     .then(data => {
//         console.log('Shortened Link:', data.link); // This will contain the shortened link
//         // Now you can use this shortened link for sharing via WhatsApp
//         const encodedLink = encodeURIComponent(data.link);
//         const whatsappURL = `whatsapp://send?text=${encodedLink}`;
//         window.open(whatsappURL);
//     })
//     .catch(error => {
//         console.error('Error shortening link:', error);
//     });
// });


// shareBtn.addEventListener("click", function() {
//     // const collectedLinks =  myLeads.filter(link => link.trim().startsWith('https')); // Filter valid URLs
//     // const formattedData = collectedLinks.join('\n'); // Format the data for sharing

//     const tabsData = JSON.parse(localStorage.getItem("myLeads"));  //IT RETURN U STRING SO JSON.parse()
//     const filteredLinks = tabsData.filter((link) => link.trim().startsWith('https'));
//     const formattedData = filteredLinks.join("\n"); // Format the data for sharing  CHWCK THIS FORMATTED DATA ??

//     const accessToken = '81656bb76873d34434811c09513c08b20a840ff5'; // Replace with your Bitly access token
//     const bitlyAPI = 'https://api-ssl.bitly.com/v4/shorten';

//     fetch(bitlyAPI, {
//         method: 'POST',
//         headers: {
//             'Authorization': `Bearer ${accessToken}`,
//             'Content-Type': 'application/json'
//         },
//         body: JSON.stringify({
//             long_url: formattedData
//         })
//     })
//     .then(response => {
//         if (!response.ok) {
//             throw new Error('Network response was not ok.');
//         }
//         return response.json();
//     })
//     .then(data => {
//         if (data && data.link) {
//             const encodedData = encodeURIComponent(formattedData);
//             const whatsappBaseURL = 'https://wa.me/?text=';
//             const whatsappURL = `${whatsappBaseURL}${encodedData}`;
//             window.open(whatsappURL, '_blank');
//         } else {
//             console.error('Error: No link found in API response');
//         }
//     })
//     .catch(error => {
//         console.error('Error fetching or parsing Bitly API response:', error);
//     });
// });

