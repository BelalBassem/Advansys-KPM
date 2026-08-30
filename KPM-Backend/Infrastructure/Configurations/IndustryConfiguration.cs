using Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Infrastructure.Configurations;

public class IndustryConfiguration : IEntityTypeConfiguration<Industry>
{
    public void Configure(EntityTypeBuilder<Industry> builder)
    {
        builder.ToTable("Industry");

        builder.HasKey(industry => industry.Id);

        builder.Property(industry => industry.CreatedDate)
            .HasColumnType("datetime");

        builder.Property(industry => industry.ModifiedDate)
            .HasColumnType("datetime");
    }
}
