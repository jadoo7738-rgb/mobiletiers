const {
  ChannelType,
  PermissionsBitField,
  ModalBuilder,
  TextInputBuilder,
  TextInputStyle,
  ActionRowBuilder
} = require("discord.js");

const ADMIN_ROLE = "1459409372118515998";

module.exports = async (interaction) => {
  try {

    // ================= BUTTON =================
    if (interaction.isButton() && interaction.customId === "waitlist_join") {

      const modal = new ModalBuilder()
        .setCustomId("waitlist_modal")
        .setTitle("Join Waitlist");

      const ign = new TextInputBuilder()
        .setCustomId("ign")
        .setLabel("Minecraft IGN")
        .setStyle(TextInputStyle.Short)
        .setRequired(true);

      const region = new TextInputBuilder()
        .setCustomId("region")
        .setLabel("Region (AS / EU)")
        .setStyle(TextInputStyle.Short)
        .setRequired(true);

      const server = new TextInputBuilder()
        .setCustomId("server")
        .setLabel("Preferred Server")
        .setStyle(TextInputStyle.Short)
        .setRequired(true);

      modal.addComponents(
        new ActionRowBuilder().addComponents(ign),
        new ActionRowBuilder().addComponents(region),
        new ActionRowBuilder().addComponents(server)
      );

      // ✅ showModal = ACK
      return await interaction.showModal(modal);
    }

    // ================= MODAL SUBMIT =================
    if (interaction.isModalSubmit() && interaction.customId === "waitlist_modal") {

      // ✅ MUST
      await interaction.deferReply({ ephemeral: true });

      const ign = interaction.fields.getTextInputValue("ign");
      const region = interaction.fields.getTextInputValue("region");
      const server = interaction.fields.getTextInputValue("server");

      const channel = await interaction.guild.channels.create({
        name: `ticket-${ign.toLowerCase()}`,
        type: ChannelType.GuildText,
        permissionOverwrites: [
          {
            id: interaction.guild.id,
            deny: [PermissionsBitField.Flags.ViewChannel]
          },
          {
            id: interaction.user.id,
            allow: [
              PermissionsBitField.Flags.ViewChannel,
              PermissionsBitField.Flags.SendMessages
            ]
          },
          {
            id: ADMIN_ROLE,
            allow: [
              PermissionsBitField.Flags.ViewChannel,
              PermissionsBitField.Flags.SendMessages
            ]
          }
        ]
      });

      await channel.send({
        content:
`🎟️ **Waitlist Ticket Created**

**IGN:** ${ign}
**Region:** ${region}
**Preferred Server:** ${server}

👤 Player: <@${interaction.user.id}>
⚠️ Fake info = instant deny`
      });

      return interaction.editReply({
        content: "✅ Ticket created successfully!"
      });
    }

  } catch (err) {
    console.error("❌ Interaction error:", err);

    if (interaction.deferred || interaction.replied) {
      interaction.editReply({ content: "❌ Something went wrong." });
    } else {
      interaction.reply({ content: "❌ Something went wrong.", ephemeral: true });
    }
  }
};
