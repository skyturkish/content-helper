const {
    SlashCommandBuilder,
    EmbedBuilder,
    ActionRowBuilder,
    StringSelectMenuBuilder,
} = require('discord.js')

var json = require('../data/videos.json')

module.exports = {
    data: new SlashCommandBuilder()
        .setName('videos')
        .setDescription('Lists the related videos with the input word.')
        .addStringOption((option) =>
            option
                .setName('content')
                .setDescription('content aramanı sağlayacak kelimeyi yaz')
                .setMinLength(2)
                .setRequired(true)
        ),

    async execute(interaction) {
        const links = {
            photo: 'https://64.media.tumblr.com/b7adc30458c015601d26467662b71ede/07cc1610225987ff-6c/s1280x1920/b29d6a1cc8e541404c330770f4c2d062d68b8c6b.jpg',
            website: 'https://content-searcher-beta-umbwiyhqiq-no.a.run.app/',
        }

        const inputValue = interaction.options
            .getString('content')
            .toLowerCase()

        const videos = json['videos']

        let videoInformations = []

        videos.forEach((video, videoIndex) => {
            video.timeStamps.forEach((timeStamp, timeStampIndex) => {
                if (timeStamp.text.toLowerCase().includes(inputValue)) {
                    videoInformations.push({
                        videoIndex: videoIndex,
                        createdAt: video.createdAt,
                        videoTimeStampText: timeStamp.text,
                        timeStampIndex: timeStampIndex,
                    })
                }
            })
        })

        if (videoInformations.length == 0) {
            await interaction.reply({
                content: 'there is no video about ' + inputValue,
                ephemeral: true,
            })
            return
        }

        // ActionRowBuilder allows maximum of 25 option
        videoInformations = videoInformations.slice(0, 25)

        const selectMenu = new ActionRowBuilder().addComponents(
            new StringSelectMenuBuilder()
                .setCustomId('Videos')
                .setPlaceholder('Nothing selected')
                .addOptions(
                    videoInformations.map(function (currentvalue, index) {
                        return {
                            label: (index + 1).toString(),
                            // value can carry only String
                            value:
                                videoInformations[index][
                                    'videoIndex'
                                ].toString() +
                                ':' +
                                videoInformations[index][
                                    'timeStampIndex'
                                ].toString(),
                        }
                    })
                )
        )

        let videoTimeStamps = ''
        //  2 - Diyalektik zırva mıdır? Yazılım ile ilişkisini nasıl görüyorsunuz? 6 Oct 2022
        //  .
        //  .
        //  9 - Almanya'da arkadaşlık kurmak zor mu? 17 Mar 2021
        videoInformations.forEach((videoInformation, index) => {
            videoTimeStamps = `${videoTimeStamps} ${index + 1} - ${
                videoInformation.videoTimeStampText
            } ${videoInformation.createdAt} \n`
        })

        const videosEmbed = new EmbedBuilder()
            .setColor(0x6b249c)
            .setTitle('Videos')
            .setURL(links.website)
            .setDescription('Some description here')
            .setDescription(videoTimeStamps)
            .setTimestamp()
            .setFooter({
                text: 'Created by skyturkish',
                iconURL: links.photo,
            })

        interaction
            .reply({
                embeds: [videosEmbed],
                ephemeral: true,
                components: [selectMenu],
            })
            .then(() => console.log('Reply sent.'))
            .catch(console.error)
    },
}
