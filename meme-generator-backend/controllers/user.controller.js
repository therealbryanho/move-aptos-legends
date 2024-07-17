const axios = require('axios')
const { OpenAIClient, AzureKeyCredential } = require("@azure/openai");
const { uploadFileOnSupabase } = require('../config/supabase');
const { extractPowersFromString } = require('../utils/helper');
const { createClient } = require('@supabase/supabase-js');
const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY)


exports.generateNFTImageAndJson = async (req, res) => {
    try {
        const { nftNumber, attackValue, defenseValue, healthValue } = req.body

        console.log({ nftNumber, attackValue, defenseValue, healthValue });

        if (!nftNumber || !attackValue || !defenseValue) {
            return res.status(422).json({ error: "One of the required parameter missing: nftNumber, attackValue, defenceValue" })
        }


        let powers = `AP: ${attackValue} | DP: ${defenseValue}`

        // Get a random meme from ImgFlip
        const memeIds = JSON.parse(process.env.IMGFLIP_MEME_IDS)

        let min = 0
        let max = memeIds.length - 1
        let randomNumber = Math.floor(Math.random() * (max - min + 1)) + min
        let randomlySelectedMemeId = memeIds[randomNumber]

        // Get a meme caption from Azure OpenAI
        try {
            let prompt = process.env.MEME_CAPTION_PROMPT

            const messages = [
                { role: "user", content: prompt }
            ]
            const client = new OpenAIClient(
                process.env.AZURE_OPENAI_ENDPOINT,
                new AzureKeyCredential(process.env.AZURE_OPENAI_API_KEY)
            )
            const completion = await client.getChatCompletions(process.env.AZURE_DEPLOYMENT_ID, messages)
            const ai_response = completion.choices[0].message.content

            // Add AI generated caption to randomly selected meme
            const createMemeResponse = await axios.post('https://api.imgflip.com/caption_image', null, {
                params: {
                    template_id: randomlySelectedMemeId,
                    username: process.env.IMGFLIP_USERNAME,
                    password: process.env.IMGFLIP_PASSWORD,
                    text0: ai_response,
                    text1: powers
                }
            })

            // check for errors
            if (!createMemeResponse.data.success) {
                console.log(`Error in captioning meme: ${createMemeResponse.data.error_message}`);
                return res.status(500).json({ error: `Error in captioning meme: ${createMemeResponse.data.error_message}. Please try again.` })
            }

            // store the image on supabase
            const memeImageResponse = await fetch(createMemeResponse.data.data.url)

            if (!memeImageResponse.ok) {
                console.log("Could not get created meme image.");
                return res.status(500).json({ error: "Could not get created meme image. Please try again." })
            }

            // upload the image on supabase
            const imageBlob = await memeImageResponse.blob()
            const supabaseImageUploadData = await uploadFileOnSupabase(imageBlob, `image/${nftNumber}.jpg`)
            if (supabaseImageUploadData.status !== 200) {
                if (supabaseImageUploadData.supabaseError.statusCode === '409') {
                    return res.status(409).json({ error: `NFT image with number '${number}' already exists. Please use another nftNumber.` })
                }
                else {
                    return res.status(500).json({ error: supabaseImageUploadData.supabaseError.message })
                }
            }

            //upload the JSON
            const json = {
                "description": "Aptos Legends",
                "name": nftNumber,
                "image": supabaseImageUploadData.uploadedFileUrl,
                "external_url": supabaseImageUploadData.uploadedFileUrl,
                "attributes": [
                    {
                        "trait_type": "AP",
                        "value": attackValue
                    },
                    {
                        "trait_type": "DP",
                        "value": defenseValue
                    }
                ],
                "properties": {
                    "files": [
                        {
                            "uri": supabaseImageUploadData.uploadedFileUrl,
                            "type": "image/jpeg"
                        }
                    ],
                    "category": "image"
                }
            }
            // console.log("json === ", json);
            const jsonString = JSON.stringify(json)
            const jsonBlob = new Blob([jsonString], { type: "application/json" })
            const supabaseJsonUploadData = await uploadFileOnSupabase(jsonBlob, `json/${nftNumber}.json`)
            if (supabaseJsonUploadData.status !== 200) {
                if (supabaseJsonUploadData.supabaseError.statusCode === '409') {
                    return res.status(409).json({ error: `NFT JSON with number '${nftNumber}' already exists. Please use another nftNumber.` })
                }
                else {
                    return res.status(500).json({ error: supabaseJsonUploadData.supabaseError.message })
                }
            }

            console.log(supabaseImageUploadData.uploadedFileUrl);
            console.log(supabaseJsonUploadData.uploadedFileUrl);

            return res.json({ image: supabaseImageUploadData.uploadedFileUrl, json: supabaseJsonUploadData.uploadedFileUrl })

        }
        catch (err) {
            console.log(err);
            return res.status(500).json({ error: "Error getting meme caption, please try again." })
        }
    }
    catch (err) {
        console.log(err);
        return res.json({ error: "Internal server error" })
    }
}

exports.generateDominatedImage = async (req, res) => {
    try {
        const { caption } = req.body

        console.log({ caption });

        if (!caption) {
            return res.status(422).json({ error: "One of the required parameter missing: caption" })
        }

        const createMemeResponse = await axios.post('https://api.imgflip.com/caption_image', null, {
            params: {
                template_id: "539240429",
                username: process.env.IMGFLIP_USERNAME,
                password: process.env.IMGFLIP_PASSWORD,
                text0: caption
            }
        })

        // check for errors
        if (!createMemeResponse.data.success) {
            console.log(`Error in captioning meme: ${createMemeResponse.data.error_message}`);
            return res.status(500).json({ error: `Error in captioning meme: ${createMemeResponse.data.error_message}. Please try again.` })
        }

        // store the image on supabase
        const memeImageResponse = await fetch(createMemeResponse.data.data.url)

        if (!memeImageResponse.ok) {
            console.log("Could not get created meme image.");
            return res.status(500).json({ error: "Could not get created meme image. Please try again." })
        }

        // upload the image on supabase
        const imageBlob = await memeImageResponse.blob()
        const supabaseImageUploadData = await uploadFileOnSupabase(imageBlob, `dominated/${Date.now()}.jpg`)
        if (supabaseImageUploadData.status !== 200) {
            if (supabaseImageUploadData.supabaseError.statusCode === '409') {
                return res.status(409).json({ error: `NFT image with number '${number}' already exists. Please use another nftNumber.` })
            }
            else {
                return res.status(500).json({ error: supabaseImageUploadData.supabaseError.message })
            }
        }

        console.log(supabaseImageUploadData.uploadedFileUrl);

        return res.json({ image: supabaseImageUploadData.uploadedFileUrl })
    }
    catch (err) {
        console.log(err);
        return res.json({ error: "Internal server error" })
    }
}



exports.allDominatedImages = async (req, res) => {
    try {

    }
    catch (err) {
        console.log(err);
        return res.status(500).json({ error: "Internal server error" })
    }
}

