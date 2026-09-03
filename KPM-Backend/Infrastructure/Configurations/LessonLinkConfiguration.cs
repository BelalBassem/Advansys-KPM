using Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Infrastructure.Configurations;

public class LessonLinkConfiguration : IEntityTypeConfiguration<LessonLink>
{
    public void Configure(EntityTypeBuilder<LessonLink> builder)
    {
        builder.ToTable("LessonLink");

        builder.HasKey(link => link.Id);

        builder.Property(link => link.Url)
            .HasMaxLength(2048)
            .IsRequired();

        builder.HasOne(link => link.Lesson)
            .WithMany(lesson => lesson.Links)
            .HasForeignKey(link => link.LessonId)
            .OnDelete(DeleteBehavior.Cascade);
    }
}
