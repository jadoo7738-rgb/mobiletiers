module.exports = async (channel) => {
  await channel.send({
    embeds: [{
      title: "📝 Evaluation Testing Waitlist",
      description:
        "**Upon applying you will added to waitlist channel**\n\n" +
        "you will get pinged when on your turn"
        "• IGN\n• Region\n• Preferred Server\n\n" +
        "⚠️ Fake info = instant deny",
      color: 0x5865f2
    }],
    components: [{
      type: 1,
      components: [{
        type: 2,
        style: 1,
        label: "Join Waitlist",
        custom_id: "waitlist_join"
      }]
    }]
  });
};
