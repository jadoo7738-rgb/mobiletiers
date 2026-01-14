module.exports = async (channel) => {
  await channel.send({
    embeds: [
      {
        title: "📝 Evaluation Testing Waitlist",
        description:
          "**Click the button below to enter the waitlist**\n\n" +
          "• IGN\n• Region\n• Preferred Server\n\n" +
          "⚠️ Fake info = instant deny",
        color: 0x5865f2
      }
    ],
    components: [
      {
        type: 1,
        components: [
          {
            type: 2,
            style: 1,
            label: "Join Waitlist",
            custom_id: "waitlist_join"
          }
        ]
      }
    ]
  });
};