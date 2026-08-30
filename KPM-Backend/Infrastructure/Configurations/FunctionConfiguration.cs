using Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Infrastructure.Configurations;

public class FunctionConfiguration : IEntityTypeConfiguration<Function>
{
    public void Configure(EntityTypeBuilder<Function> builder)
    {
        builder.ToTable("Function");

        builder.HasKey(function => function.Id);

        builder.Property(function => function.CreatedDate)
            .HasColumnType("datetime");

        builder.Property(function => function.LastModifiedDate)
            .HasColumnType("datetime");
    }
}
