namespace Application.Features.Lesson;
using Application.Common.Interfaces;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using LessonEntity = Domain.Entities.Lesson;
using LessonDocumentEntity = Domain.Entities.LessonDocument;
using LessonKeywordEntity = Domain.Entities.LessonKeyword;
using LessonLinkEntity = Domain.Entities.LessonLink;

public class LessonService
{
    private readonly IApplicationDBContext _context;
    private readonly ILogger<LessonService> _logger;

    public LessonService(IApplicationDBContext context, ILogger<LessonService> logger)
    {
        _context = context;
        _logger = logger;
    }

    public async Task<List<LessonEntity>> getAllLessons()
    {
        try
        {
            var lessons = await LessonQuery()
                .AsNoTracking()
                .ToListAsync();

            _logger.LogInformation("Lessons retrieved successfully");
            return lessons;
        }
        catch (Exception exception)
        {
            _logger.LogError(exception, "Failed to retrieve lessons");
            throw;
        }
    }

    public async Task<LessonEntity?> getLesson(Guid id)
    {
        return await LessonQuery()
            .AsNoTracking()
            .FirstOrDefaultAsync(lesson => lesson.Id == id);
    }

    public async Task<Guid> createLesson(LessonEntity lesson)
    {
        var validationError = await ValidateLessonReferences(
            lesson.DepartmentId,
            lesson.FunctionId,
            lesson.IndustryId,
            lesson.PersonToContactId);

        if (validationError is not null)
            throw new ArgumentException(validationError);

        var links = lesson.Links?.ToList();
        var keywords = lesson.Keywords?.ToList();
        var documents = lesson.Documents?.ToList();
        var now = DateTime.Now;

        lesson.Id = Guid.NewGuid();
        lesson.CreatedDate = now;
        lesson.ModifiedDate = now;

        // References are inserted explicitly through their own DbSets below.
        lesson.Links = new List<LessonLinkEntity>();
        lesson.Keywords = new List<LessonKeywordEntity>();
        lesson.Documents = new List<LessonDocumentEntity>();

        await _context.Lesson.AddAsync(lesson);
        await AddLinks(lesson.Id, links);
        await AddKeywords(lesson.Id, keywords);
        await AddDocuments(lesson.Id, documents);
        await _context.SaveChangesAsync();

        return lesson.Id;
    }

    public async Task<Guid?> updateLesson(Guid id, LessonEntity updatedLesson)
    {
        var lesson = await _context.Lesson
            .Include(lesson => lesson.Links)
            .Include(lesson => lesson.Keywords)
            .Include(lesson => lesson.Documents)
            .FirstOrDefaultAsync(lesson => lesson.Id == id);

        if (lesson is null)
            return null;

        var validationError = await ValidateLessonReferences(
            updatedLesson.DepartmentId,
            updatedLesson.FunctionId,
            updatedLesson.IndustryId,
            updatedLesson.PersonToContactId);

        if (validationError is not null)
            throw new ArgumentException(validationError);

        lesson.Title = updatedLesson.Title;
        lesson.ProjectName = updatedLesson.ProjectName;
        lesson.DepartmentId = updatedLesson.DepartmentId;
        lesson.FunctionId = updatedLesson.FunctionId;
        lesson.IndustryId = updatedLesson.IndustryId;
        lesson.PersonToContactId = updatedLesson.PersonToContactId;
        lesson.Summary = updatedLesson.Summary;
        lesson.Description = updatedLesson.Description;
        lesson.ImageUrl = updatedLesson.ImageUrl;
        lesson.ModifiedDate = DateTime.Now;

        _context.LessonLink.RemoveRange(lesson.Links);
        _context.LessonKeyword.RemoveRange(lesson.Keywords);
        _context.LessonDocument.RemoveRange(lesson.Documents);

        await AddLinks(lesson.Id, updatedLesson.Links);
        await AddKeywords(lesson.Id, updatedLesson.Keywords);
        await AddDocuments(lesson.Id, updatedLesson.Documents);

        await _context.SaveChangesAsync();
        return lesson.Id;
    }

    public async Task<Guid?> deleteLesson(Guid id)
    {
        var lesson = await _context.Lesson.FirstOrDefaultAsync(lesson => lesson.Id == id);

        if (lesson is null)
            return null;

        _context.Lesson.Remove(lesson);
        await _context.SaveChangesAsync();
        return lesson.Id;
    }

    private IQueryable<LessonEntity> LessonQuery()
    {
        return _context.Lesson
            .Include(lesson => lesson.Links)
            .Include(lesson => lesson.Keywords)
            .Include(lesson => lesson.Documents)
            .Include(lesson => lesson.PersonToContact);
    }

    private async Task<string?> ValidateLessonReferences(
        int departmentId,
        int functionId,
        int industryId,
        Guid personToContactId)
    {
        var departmentExists = await _context.Department.AnyAsync(department => department.Id == departmentId);
        if (!departmentExists)
            return "Selected department does not exist.";

        var functionExists = await _context.Function.AnyAsync(function => function.Id == functionId);
        if (!functionExists)
            return "Selected function does not exist.";

        var industryExists = await _context.Industry.AnyAsync(industry => industry.Id == industryId);
        if (!industryExists)
            return "Selected industry does not exist.";

        var userExists = await _context.User.AnyAsync(user => user.Id == personToContactId);
        if (!userExists)
            return "Selected person to contact does not exist.";

        var departmentFunctionExists = await _context.DepartmentFunction.AnyAsync(departmentFunction =>
            departmentFunction.DepartmentID == departmentId &&
            departmentFunction.FunctionID == functionId);

        if (!departmentFunctionExists)
            return "Selected function is not linked to the selected department.";

        return null;
    }

    private async Task AddLinks(Guid lessonId, IEnumerable<LessonLinkEntity>? links)
    {
        var lessonLinks = (links ?? Enumerable.Empty<LessonLinkEntity>())
            .Where(link => !string.IsNullOrWhiteSpace(link.Url))
            .Select(link => link.Url.Trim())
            .Distinct(StringComparer.OrdinalIgnoreCase)
            .Select(url => new LessonLinkEntity
            {
                LessonId = lessonId,
                Url = url
            })
            .ToList();

        if (lessonLinks.Count > 0)
            await _context.LessonLink.AddRangeAsync(lessonLinks);
    }

    private async Task AddKeywords(Guid lessonId, IEnumerable<LessonKeywordEntity>? keywords)
    {
        var lessonKeywords = (keywords ?? Enumerable.Empty<LessonKeywordEntity>())
            .Where(keyword => !string.IsNullOrWhiteSpace(keyword.Name))
            .Select(keyword => keyword.Name.Trim())
            .Distinct(StringComparer.OrdinalIgnoreCase)
            .Select(name => new LessonKeywordEntity
            {
                LessonId = lessonId,
                Name = name
            })
            .ToList();

        if (lessonKeywords.Count > 0)
            await _context.LessonKeyword.AddRangeAsync(lessonKeywords);
    }

    private async Task AddDocuments(Guid lessonId, IEnumerable<LessonDocumentEntity>? documents)
    {
        var lessonDocuments = (documents ?? Enumerable.Empty<LessonDocumentEntity>())
            .Where(document =>
                !string.IsNullOrWhiteSpace(document.FileName) &&
                !string.IsNullOrWhiteSpace(document.FileUrl) &&
                !string.IsNullOrWhiteSpace(document.ContentType))
            .Select(document => new LessonDocumentEntity
            {
                LessonId = lessonId,
                FileName = document.FileName.Trim(),
                FileUrl = document.FileUrl.Trim(),
                ContentType = document.ContentType.Trim()
            })
            .ToList();

        if (lessonDocuments.Count > 0)
            await _context.LessonDocument.AddRangeAsync(lessonDocuments);
    }
}
