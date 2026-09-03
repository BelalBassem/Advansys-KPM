using Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Infrastructure.Configurations;

public class LessonDocumentConfiguration : IEntityTypeConfiguration<LessonDocument>
{
    public void Configure(EntityTypeBuilder<LessonDocument> builder)
    {
        builder.ToTable("LessonDocument");

        builder.HasKey(document => document.Id);

        builder.Property(document => document.FileName)
            .HasMaxLength(255)
            .IsRequired();

        builder.Property(document => document.FileUrl)
            .HasMaxLength(2048)
            .IsRequired();

        builder.Property(document => document.ContentType)
            .HasMaxLength(100)
            .IsRequired();

        builder.HasOne(document => document.Lesson)
            .WithMany(lesson => lesson.Documents)
            .HasForeignKey(document => document.LessonId)
            .OnDelete(DeleteBehavior.Cascade);
    }
}
