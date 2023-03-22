from resources import api_resources


def main():
    for resource in api_resources:
        resource.translate_to_fixture()


if __name__ == "__main__":
    main()
